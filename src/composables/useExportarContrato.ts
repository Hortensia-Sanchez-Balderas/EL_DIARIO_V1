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

async function generarPdf(datos: DatosExport): Promise<Blob> {
  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2
  const gap = 5
  const cardWidth = (contentWidth - gap) / 2
  let y = 0

  const dibujarEncabezado = (continuacion = false) => {
    pdf.setFillColor(0, 102, 61)
    pdf.rect(0, 0, pageWidth, 37, "F")
    pdf.setTextColor(255, 255, 255)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(15)
    pdf.text("EL DIARIO DE COAHUILA", margin, 15)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.text(datos.titulo, margin, 24, { maxWidth: contentWidth - 10 })
    if (continuacion) {
      pdf.setFontSize(8)
      pdf.text("CONTINUACION", pageWidth - margin, 15, { align: "right" })
    }
    pdf.setTextColor(30, 41, 38)
    y = 45
  }

  dibujarEncabezado()

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) {
      pdf.addPage()
      dibujarEncabezado(true)
    }
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(0, 102, 61)
  pdf.text("DATOS DEL CONTRATO", margin, y)
  y += 5

  for (let index = 0; index < datos.campos.length; index += 2) {
    const camposFila = datos.campos.slice(index, index + 2)
    const tarjetas = camposFila.map((campo) => {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(8)
      const etiqueta = pdf.splitTextToSize(campo.etiqueta.toUpperCase(), cardWidth - 10)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      const valor = pdf.splitTextToSize(campo.valor || "—", cardWidth - 10)
      const alto = Math.max(17, 8 + etiqueta.length * 3.5 + valor.length * 4.2)
      return { campo, etiqueta, valor, alto }
    })
    const altoFila = Math.max(...tarjetas.map((tarjeta) => tarjeta.alto))
    ensureSpace(altoFila + gap)

    tarjetas.forEach((tarjeta, columna) => {
      const x = margin + columna * (cardWidth + gap)
      pdf.setFillColor(245, 248, 246)
      pdf.setDrawColor(222, 231, 225)
      pdf.setLineWidth(0.25)
      pdf.roundedRect(x, y, cardWidth, altoFila, 2, 2, "FD")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(8)
      pdf.setTextColor(0, 102, 61)
      pdf.text(tarjeta.etiqueta, x + 5, y + 6)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      pdf.setTextColor(38, 48, 43)
      pdf.text(tarjeta.valor, x + 5, y + 10 + tarjeta.etiqueta.length * 3.5)
    })

    y += altoFila + gap
  }

  const totalGap = 4
  const totalWidth = (contentWidth - totalGap * (datos.totales.length - 1)) / datos.totales.length
  const totalHeight = 24
  ensureSpace(totalHeight + 8)
  y += 2

  datos.totales.forEach((total, index) => {
    const x = margin + index * (totalWidth + totalGap)
    const destacado = index === datos.totales.length - 1
    pdf.setFillColor(...(destacado ? [0, 102, 61] : [238, 243, 239]))
    pdf.setDrawColor(...(destacado ? [0, 102, 61] : [222, 231, 225]))
    pdf.roundedRect(x, y, totalWidth, totalHeight, 2, 2, "FD")

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(...(destacado ? [225, 242, 232] : [91, 105, 97]))
    pdf.text(total.etiqueta.toUpperCase(), x + totalWidth / 2, y + 8, { align: "center" })

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(11)
    pdf.setTextColor(...(destacado ? [255, 255, 255] : [38, 48, 43]))
    pdf.text(total.valor || "—", x + totalWidth / 2, y + 17, { align: "center" })
  })

  const pageCount = pdf.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page)
    pdf.setDrawColor(220, 226, 222)
    pdf.setLineWidth(0.25)
    pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(120, 130, 124)
    pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 5, { align: "right" })
  }

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
        blob = await generarPdf(opts.datos)
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
