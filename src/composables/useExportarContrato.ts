export type FormatoExport = "PDF" | "WORD" | "JPG"

export interface CampoExport {
  etiqueta: string
  valor: string
}

export interface DatosExport {
  titulo: string
  campos: CampoExport[]
  totales: CampoExport[]
}

export interface OpcionesExport {
  idContrato: number
  idEmpleado: string
  formatos: FormatoExport[]
  hoja: HTMLElement | null
  datos: DatosExport
  prefijo: string
}

function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function capturarCanvas(hoja: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas")
  return html2canvas(hoja, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    ignoreElements: (el) => el.hasAttribute("data-no-export"),
  })
}

async function generarJpg(hoja: HTMLElement): Promise<Blob> {
  const canvas = await capturarCanvas(hoja)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen JPG"))),
      "image/jpeg",
      0.92,
    )
  })
}

async function generarPdf(hoja: HTMLElement): Promise<Blob> {
  const canvas = await capturarCanvas(hoja)
  const { jsPDF } = await import("jspdf")
  const imgData = canvas.toDataURL("image/jpeg", 0.95)
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const maxWidth = pageWidth - margin * 2
  const maxHeight = pageHeight - margin * 2

  let imgWidth = maxWidth
  let imgHeight = (canvas.height * imgWidth) / canvas.width
  if (imgHeight > maxHeight) {
    imgHeight = maxHeight
    imgWidth = (canvas.width * imgHeight) / canvas.height
  }

  const x = (pageWidth - imgWidth) / 2
  pdf.addImage(imgData, "JPEG", x, margin, imgWidth, imgHeight)
  return pdf.output("blob")
}

async function generarWord(datos: DatosExport): Promise<Blob> {
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType } =
    await import("docx")

  const filasCampos = datos.campos.map(
    (c) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: c.etiqueta, bold: true })] })],
          }),
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: c.valor || "—" })],
          }),
        ],
      }),
  )

  const filasTotales = datos.totales.map(
    (t) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: t.etiqueta, bold: true })] })],
          }),
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: t.valor, bold: true })] })],
          }),
        ],
      }),
  )

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: "EL DIARIO DE COAHUILA", bold: true, size: 32 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: datos.titulo.toUpperCase(), bold: true, size: 24 })],
            spacing: { after: 240 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [...filasCampos, ...filasTotales],
          }),
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}

export async function exportarContrato(opts: OpcionesExport): Promise<{ errores: string[] }> {
  const { contratoService } = await import("@/services/contratoService")
  const errores: string[] = []

  for (const formato of opts.formatos) {
    try {
      let blob: Blob
      let ext: string
      let mime: string

      if (formato === "JPG") {
        if (!opts.hoja) throw new Error("No se encontró el contenedor visual del contrato")
        blob = await generarJpg(opts.hoja)
        ext = "jpg"
        mime = "image/jpeg"
      } else if (formato === "PDF") {
        if (!opts.hoja) throw new Error("No se encontró el contenedor visual del contrato")
        blob = await generarPdf(opts.hoja)
        ext = "pdf"
        mime = "application/pdf"
      } else {
        blob = await generarWord(opts.datos)
        ext = "docx"
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }

      const nombre = `${opts.prefijo}-${opts.idContrato}.${ext}`
      descargarBlob(blob, nombre)

      await contratoService.subirArchivo({
        idContrato: opts.idContrato,
        idEmpleado: opts.idEmpleado,
        formato,
        nombre,
        mime,
        blob,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errores.push(`${formato}: ${msg}`)
    }
  }

  return { errores }
}
