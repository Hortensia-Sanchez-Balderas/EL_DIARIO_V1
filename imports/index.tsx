import imgImage117 from "./f36212a401791824b365004743a8fe4f75dcb0c5.png";
import imgImage118 from "./fdda0f172f28d28f3bc7628433599badb09cdca7.png";
import imgImage50 from "./83bf7d2c651c44020757fd3539c0aba6a31c625d.png";
import imgRadio2 from "./e7f160d0824effacd9fa76e517c0d85f16593df0.png";
import imgMicrofono2 from "./aab73b63c3227c750956aa19ccefc2c1aa9d51fb.png";
import imgPeriodico11 from "./fa4f0e56a970cdaf3ba3d08a143cee0cfb991574.png";
import imgIconoSalir from "./02755f889b6358bf1fe449327abfc309a592f797.png";
import imgIconoCalendario from "./622f60602b335499e0d757890d14116e0ed62d86.png";
import imgAgenda11 from "./104275b234b45f1074ea7bbde3197d29ffc2520c.png";
import imgImage51 from "./8ab26e2a2220772f69a2de983fc3c917b5f0011b.png";
import imgIconoSeguimientoClientes from "./d6255fa607198ecb0e8ab69cc9e6d6b26d5e8d89.png";
import imgImage17 from "./84b0cf836cdcd6aabb74192cd69ba4e1cb0526a6.png";
import imgImage19 from "./c6b90af9eb45368aac260101b9a38cafbe46846d.png";
import imgAccount12 from "./9dd8cd448fdab2c6f179cbe594c98aa26754eab8.png";
import imgDown2 from "./3eebcc5fa6f85e4f75e8e0d94555fb899e0bd68a.png";
import { imgImage16, imgImage18 } from "./svg-sijnq";
type ModuloDeEditarPendientesProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Active";
};

function ModuloDeEditarPendientes({ className, property1 = "Default" }: ModuloDeEditarPendientesProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#a87516] h-[126px] relative rounded-[10px] to-[#8d1b22] w-[253px]"} data-name="Property 1=Active">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoEditar/Pendientes">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[79.349px]" data-name="image 117">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage117} />
              </div>
              <div className="col-1 ml-[33.28px] mt-[48.63px] relative row-1 size-[44.367px]" data-name="image 118">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage118} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Editar / Pendientes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (property1 === "Hover") {
    return (
      <button className={className || "bg-gradient-to-b cursor-pointer from-[#d89e1d] h-[126px] relative rounded-[10px] to-[#c62a2f] w-[253px]"} data-name="Property 1=Hover">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoEditar/Pendientes">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[79.349px]" data-name="image 117">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage117} />
              </div>
              <div className="col-1 ml-[33.28px] mt-[48.63px] relative row-1 size-[44.367px]" data-name="image 118">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage118} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
              <p className="leading-[normal]">Editar / Pendientes</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#fac73c] h-[126px] relative rounded-[10px] to-[#ef4743] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoEditar/Pendientes">
            <div className="col-1 ml-0 mt-0 relative row-1 size-[79.349px]" data-name="image 117">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage117} />
            </div>
            <div className="col-1 ml-[33.28px] mt-[48.63px] relative row-1 size-[44.367px]" data-name="image 118">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage118} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            <p className="leading-[normal]">Editar / Pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type ModuloDePaquetesDeRadioProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Active";
};

function ModuloDePaquetesDeRadio({ className, property1 = "Default" }: ModuloDePaquetesDeRadioProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#0040c2] h-[126px] relative rounded-[10px] to-[#00256f] w-[253px]"} data-name="Property 1=Active">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoPaquetesRadio">
              <div className="col-1 h-[93px] ml-0 mt-0 relative row-1 w-[121.786px]" data-name="image 50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[130.95%] left-0 max-w-none top-[-15.48%] w-full" src={imgImage50} />
                </div>
              </div>
              <div className="col-1 ml-[43.18px] mt-[19.93px] relative row-1 size-[57.571px]" data-name="radio 2">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRadio2} />
              </div>
              <div className="col-1 ml-[3.32px] mt-[36.54px] relative row-1 size-[37.643px]" data-name="microfono 2">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMicrofono2} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Paquetes de Radio</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (property1 === "Hover") {
    return (
      <button className={className || "bg-gradient-to-b cursor-pointer from-[#004fe6] h-[126px] relative rounded-[10px] to-[#002f88] w-[253px]"} data-name="Property 1=Hover">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoPaquetesRadio">
              <div className="col-1 h-[93px] ml-0 mt-0 relative row-1 w-[121.786px]" data-name="image 50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[130.95%] left-0 max-w-none top-[-15.48%] w-full" src={imgImage50} />
                </div>
              </div>
              <div className="col-1 ml-[43.18px] mt-[19.93px] relative row-1 size-[57.571px]" data-name="radio 2">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRadio2} />
              </div>
              <div className="col-1 ml-[3.32px] mt-[36.54px] relative row-1 size-[37.643px]" data-name="microfono 2">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMicrofono2} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
              <p className="leading-[normal]">Paquetes de Radio</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#0059ff] h-[126px] relative rounded-[10px] to-[#003699] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoPaquetesRadio">
            <div className="col-1 h-[93px] ml-0 mt-0 relative row-1 w-[121.786px]" data-name="image 50">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute h-[130.95%] left-0 max-w-none top-[-15.48%] w-full" src={imgImage50} />
              </div>
            </div>
            <div className="col-1 ml-[43.18px] mt-[19.93px] relative row-1 size-[57.571px]" data-name="radio 2">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRadio2} />
            </div>
            <div className="col-1 ml-[3.32px] mt-[36.54px] relative row-1 size-[37.643px]" data-name="microfono 2">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMicrofono2} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            <p className="leading-[normal]">Paquetes de Radio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type ModuloDePaquetesDePeriodicoProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Active";
};

function ModuloDePaquetesDePeriodico({ className, property1 = "Default" }: ModuloDePaquetesDePeriodicoProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#c76628] h-[126px] relative rounded-[10px] to-[#b23134] w-[253px]"} data-name="Property 1=Active">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoPaquetesPeriodico">
              <div className="col-1 h-[93px] ml-0 mt-0 relative row-1 w-[123.635px]" data-name="image 49">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[132.94%] left-0 max-w-none top-[-16.47%] w-full" src={imgImage50} />
                </div>
              </div>
              <div className="col-1 ml-[30.64px] mt-[22.98px] relative row-1 size-[62.365px]" data-name="periodico (1) 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPeriodico11} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Paquetes de Periódico</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (property1 === "Hover") {
    return (
      <button className={className || "bg-gradient-to-b cursor-pointer from-[#e77e34] h-[126px] relative rounded-[10px] to-[#d63c3d] w-[253px]"} data-name="Property 1=Hover">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoPaquetesPeriodico">
              <div className="col-1 h-[93px] ml-0 mt-0 relative row-1 w-[123.635px]" data-name="image 49">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[132.94%] left-0 max-w-none top-[-16.47%] w-full" src={imgImage50} />
                </div>
              </div>
              <div className="col-1 ml-[30.64px] mt-[22.98px] relative row-1 size-[62.365px]" data-name="periodico (1) 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPeriodico11} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
              <p className="leading-[normal]">Paquetes de Periódico</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#fa8c3c] h-[126px] relative rounded-[10px] to-[#ef4743] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoPaquetesPeriodico">
            <div className="col-1 h-[93px] ml-0 mt-0 relative row-1 w-[123.635px]" data-name="image 49">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute h-[132.94%] left-0 max-w-none top-[-16.47%] w-full" src={imgImage50} />
              </div>
            </div>
            <div className="col-1 ml-[30.64px] mt-[22.98px] relative row-1 size-[62.365px]" data-name="periodico (1) 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPeriodico11} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            <p className="leading-[normal]">Paquetes de Periódico</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type ModuloDeSalirProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Active";
};

function ModuloDeSalir({ className, property1 = "Default" }: ModuloDeSalirProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#a9191e] h-[126px] overflow-clip relative rounded-[10px] to-[#8b0e2b] w-[253px]"} data-name="Property 1=Active">
        <div className="absolute h-[93px] left-[91.5px] top-[4px] w-[84px]" data-name="IconoSalir">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-5.19%] max-w-none top-0 w-[110.39%]" src={imgIconoSalir} />
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] left-[114px] not-italic text-[12px] text-white top-[111.5px] whitespace-nowrap">
          <p className="leading-[normal]">Salir</p>
        </div>
      </div>
    );
  }
  if (property1 === "Hover") {
    return (
      <button className={className || "bg-gradient-to-b block cursor-pointer from-[#c82123] h-[126px] overflow-clip relative rounded-[10px] to-[#a51133] w-[253px]"} data-name="Property 1=Hover">
        <div className="absolute h-[93px] left-[91.5px] top-[4px] w-[84px]" data-name="IconoSalir">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-5.19%] max-w-none top-0 w-[110.39%]" src={imgIconoSalir} />
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] left-[114px] not-italic text-[12px] text-left text-white top-[111.5px] whitespace-nowrap">
          <p className="leading-[normal]">Salir</p>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#da2527] h-[126px] overflow-clip relative rounded-[10px] to-[#bf133b] w-[253px]"} data-name="Property 1=Default">
      <div className="absolute h-[93px] left-[91.5px] top-[4px] w-[84px]" data-name="IconoSalir">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-5.19%] max-w-none top-0 w-[110.39%]" src={imgIconoSalir} />
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] left-[114px] not-italic text-[12px] text-white top-[111.5px] whitespace-nowrap">
        <p className="leading-[normal]">Salir</p>
      </div>
    </div>
  );
}
type ModuloDeAgendaProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Active";
};

function ModuloDeAgenda({ className, property1 = "Default" }: ModuloDeAgendaProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#4949c4] h-[126px] relative rounded-[10px] to-[#5d28c0] w-[253px]"} data-name="Property 1=Active">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[36px] py-[70px] relative size-full">
            <div className="h-[93px] relative shrink-0 w-[106px]" data-name="IconoCalendario">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute h-[113.94%] left-0 max-w-none top-[-6.89%] w-full" src={imgIconoCalendario} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Agenda</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (property1 === "Hover") {
    return (
      <button className={className || "bg-gradient-to-b cursor-pointer from-[#5757d9] h-[126px] relative rounded-[10px] to-[#6c2fd9] w-[253px]"} data-name="Property 1=Hover">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[36px] py-[70px] relative size-full">
            <div className="h-[93px] relative shrink-0 w-[106px]" data-name="IconoCalendario">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute h-[113.94%] left-0 max-w-none top-[-6.89%] w-full" src={imgIconoCalendario} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
              <p className="leading-[normal]">Agenda</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#6464f0] h-[126px] relative rounded-[10px] to-[#7b3dee] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[36px] py-[70px] relative size-full">
          <div className="h-[93px] relative shrink-0 w-[106px]" data-name="IconoCalendario">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[113.94%] left-0 max-w-none top-[-6.89%] w-full" src={imgIconoCalendario} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            <p className="leading-[normal]">Agenda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type ModuloDeNuevoProspectoProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Active";
};

function ModuloDeNuevoProspecto({ className, property1 = "Default" }: ModuloDeNuevoProspectoProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#178f4b] h-[126px] relative rounded-[10px] to-[#046e4f] w-[253px]"} data-name="Property 1=Active">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoNuevoProspecto">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[93px]" data-name="agenda (1) 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAgenda11} />
              </div>
              <div className="col-1 h-[52.313px] ml-[26.16px] mt-[20.34px] relative row-1 w-[51.344px]" data-name="image 51">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage51} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Nuevo Prospecto</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (property1 === "Hover") {
    return (
      <button className={className || "bg-gradient-to-b cursor-pointer from-[#1ba955] h-[126px] relative rounded-[10px] to-[#06845c] w-[253px]"} data-name="Property 1=Hover">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoNuevoProspecto">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[93px]" data-name="agenda (1) 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAgenda11} />
              </div>
              <div className="col-1 h-[52.313px] ml-[26.16px] mt-[20.34px] relative row-1 w-[51.344px]" data-name="image 51">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage51} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
              <p className="leading-[normal]">Nuevo Prospecto</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#20c25e] h-[126px] relative rounded-[10px] to-[#079968] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoNuevoProspecto">
            <div className="col-1 ml-0 mt-0 relative row-1 size-[93px]" data-name="agenda (1) 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAgenda11} />
            </div>
            <div className="col-1 h-[52.313px] ml-[26.16px] mt-[20.34px] relative row-1 w-[51.344px]" data-name="image 51">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage51} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            <p className="leading-[normal]">Nuevo Prospecto</p>
          </div>
        </div>
      </div>
    </div>
  );
}
type ModuloDeSeguimientoAClienteProps = {
  className?: string;
  property1?: "Active" | "Default";
};

function ModuloDeSeguimientoACliente({ className, property1 = "Default" }: ModuloDeSeguimientoAClienteProps) {
  if (property1 === "Active") {
    return (
      <div className={className || "bg-gradient-to-b from-[#129ea3] h-[126px] relative rounded-[10px] to-[#06484e] w-[253px]"} data-name="Property 1=Active">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoNuevoProspecto">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[93px]" data-name="IconoSeguimientoClientes">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgIconoSeguimientoClientes} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Seguimiento a Cliente</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <button className={className || "bg-gradient-to-b cursor-pointer from-[#1edae0] h-[126px] relative rounded-[10px] to-[#0b6e77] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoNuevoProspecto">
            <div className="col-1 ml-0 mt-0 relative row-1 size-[93px]" data-name="IconoSeguimientoClientes">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgIconoSeguimientoClientes} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
            <p className="leading-[normal]">Seguimiento a Cliente</p>
          </div>
        </div>
      </div>
    </button>
  );
}
type ModuloDeRegistrosProps = {
  className?: string;
  property1?: "Default" | "Variant2" | "Variant3";
};

function ModuloDeRegistros({ className, property1 = "Default" }: ModuloDeRegistrosProps) {
  if (property1 === "Variant2") {
    return (
      <button className={className || "bg-gradient-to-b cursor-pointer from-[#6eb417] h-[126px] relative rounded-[10px] to-[#189740] w-[253px]"} data-name="Property 1=Variant2">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoRegistros">
              <div className="col-1 h-[84.545px] ml-0 mt-[8.45px] relative rounded-[3px] row-1 w-[68px]" style={{ backgroundImage: "linear-gradient(144.99257125646258deg, rgb(254, 151, 56) 2.5202%, rgb(121, 56, 41) 97.284%)" }} />
              <div className="col-1 h-[73.977px] ml-[4.46px] mt-[14.8px] pointer-events-none relative rounded-[3px] row-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[60.197px]">
                <div aria-hidden className="absolute inset-0 rounded-[3px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 60.197 73.977' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(5.2393 6.9222 -5.6327 3.8317 5.5738 3.1705)'><stop stop-color='rgba(245,251,255,1)' offset='0'/><stop stop-color='rgba(229,242,254,1)' offset='0.40666'/><stop stop-color='rgba(168,209,246,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
                <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_-4px_4px_0px_#9dc4ec]" />
              </div>
              <div className="col-1 h-[16.909px] ml-[7.8px] mt-[43.33px] relative rounded-[2px] row-1 w-[53.508px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 53.508 16.909' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6787 -0.95114 3.9089 1.5097 26.754 8.4545)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[10.568px] ml-[7.8px] mt-[25.36px] relative rounded-[30px] row-1 w-[53.508px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 53.508 10.568' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6787 -0.59446 3.9089 0.94359 26.754 5.2841)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[14.795px] ml-[45.7px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[14.795px] ml-[26.75px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[14.795px] ml-[7.8px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="bg-gradient-to-b col-1 from-[#c2d0da] h-[10.568px] ml-[20.07px] mt-[6.34px] relative rounded-bl-[1px] rounded-br-[1px] rounded-tl-[3px] rounded-tr-[3px] row-1 shadow-[0px_4px_4px_0px_rgba(145,181,214,0.9)] to-[#6d7e89] w-[28.984px]" />
              <div className="col-1 h-[6.341px] ml-[27.87px] mt-0 relative rounded-bl-[1px] rounded-br-[1px] rounded-tl-[25px] rounded-tr-[25px] row-1 w-[13.377px]" style={{ backgroundImage: "linear-gradient(125.7235440921163deg, rgb(197, 211, 221) 24.576%, rgb(118, 135, 145) 100%)" }} />
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
              <p className="leading-[normal]">Registros</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
  if (property1 === "Variant3") {
    return (
      <div className={className || "bg-gradient-to-b from-[#5f9c14] h-[126px] relative rounded-[10px] to-[#147f36] w-[253px]"} data-name="Property 1=Variant3">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoRegistros">
              <div className="col-1 h-[84.545px] ml-0 mt-[8.45px] relative rounded-[3px] row-1 w-[68px]" style={{ backgroundImage: "linear-gradient(144.99257125646258deg, rgb(254, 151, 56) 2.5202%, rgb(121, 56, 41) 97.284%)" }} />
              <div className="col-1 h-[73.977px] ml-[4.46px] mt-[14.8px] pointer-events-none relative rounded-[3px] row-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[60.197px]">
                <div aria-hidden className="absolute inset-0 rounded-[3px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 60.197 73.977' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(5.2393 6.9222 -5.6327 3.8317 5.5738 3.1705)'><stop stop-color='rgba(245,251,255,1)' offset='0'/><stop stop-color='rgba(229,242,254,1)' offset='0.40666'/><stop stop-color='rgba(168,209,246,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
                <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_-4px_4px_0px_#9dc4ec]" />
              </div>
              <div className="col-1 h-[16.909px] ml-[7.8px] mt-[43.33px] relative rounded-[2px] row-1 w-[53.508px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 53.508 16.909' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6787 -0.95114 3.9089 1.5097 26.754 8.4545)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[10.568px] ml-[7.8px] mt-[25.36px] relative rounded-[30px] row-1 w-[53.508px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 53.508 10.568' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6787 -0.59446 3.9089 0.94359 26.754 5.2841)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[14.795px] ml-[45.7px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[14.795px] ml-[26.75px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="col-1 h-[14.795px] ml-[7.8px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="bg-gradient-to-b col-1 from-[#c2d0da] h-[10.568px] ml-[20.07px] mt-[6.34px] relative rounded-bl-[1px] rounded-br-[1px] rounded-tl-[3px] rounded-tr-[3px] row-1 shadow-[0px_4px_4px_0px_rgba(145,181,214,0.9)] to-[#6d7e89] w-[28.984px]" />
              <div className="col-1 h-[6.341px] ml-[27.87px] mt-0 relative rounded-bl-[1px] rounded-br-[1px] rounded-tl-[25px] rounded-tr-[25px] row-1 w-[13.377px]" style={{ backgroundImage: "linear-gradient(125.7235440921163deg, rgb(197, 211, 221) 24.576%, rgb(118, 135, 145) 100%)" }} />
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              <p className="leading-[normal]">Registros</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className || "bg-gradient-to-b from-[#7cc91a] h-[126px] relative rounded-[10px] to-[#1ba547] w-[253px]"} data-name="Property 1=Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] px-[36px] py-[70px] relative size-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="IconoRegistros">
            <div className="col-1 h-[84.545px] ml-0 mt-[8.45px] relative rounded-[3px] row-1 w-[68px]" style={{ backgroundImage: "linear-gradient(144.99257125646258deg, rgb(254, 151, 56) 2.5202%, rgb(121, 56, 41) 97.284%)" }} />
            <div className="col-1 h-[73.977px] ml-[4.46px] mt-[14.8px] pointer-events-none relative rounded-[3px] row-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[60.197px]">
              <div aria-hidden className="absolute inset-0 rounded-[3px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 60.197 73.977' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(5.2393 6.9222 -5.6327 3.8317 5.5738 3.1705)'><stop stop-color='rgba(245,251,255,1)' offset='0'/><stop stop-color='rgba(229,242,254,1)' offset='0.40666'/><stop stop-color='rgba(168,209,246,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_-4px_4px_0px_#9dc4ec]" />
            </div>
            <div className="col-1 h-[16.909px] ml-[7.8px] mt-[43.33px] relative rounded-[2px] row-1 w-[53.508px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 53.508 16.909' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6787 -0.95114 3.9089 1.5097 26.754 8.4545)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
            <div className="col-1 h-[10.568px] ml-[7.8px] mt-[25.36px] relative rounded-[30px] row-1 w-[53.508px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 53.508 10.568' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6787 -0.59446 3.9089 0.94359 26.754 5.2841)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
            <div className="col-1 h-[14.795px] ml-[45.7px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
            <div className="col-1 h-[14.795px] ml-[26.75px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
            <div className="col-1 h-[14.795px] ml-[7.8px] mt-[64.47px] relative rounded-[2px] row-1 w-[15.607px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 15.607 14.795' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.073 -0.83224 1.1401 1.321 7.8033 7.3977)'><stop stop-color='rgba(209,231,251,1)' offset='0'/><stop stop-color='rgba(173,207,241,1)' offset='0.5'/><stop stop-color='rgba(137,184,230,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
            <div className="bg-gradient-to-b col-1 from-[#c2d0da] h-[10.568px] ml-[20.07px] mt-[6.34px] relative rounded-bl-[1px] rounded-br-[1px] rounded-tl-[3px] rounded-tr-[3px] row-1 shadow-[0px_4px_4px_0px_rgba(145,181,214,0.9)] to-[#6d7e89] w-[28.984px]" />
            <div className="col-1 h-[6.341px] ml-[27.87px] mt-0 relative rounded-bl-[1px] rounded-br-[1px] rounded-tl-[25px] rounded-tr-[25px] row-1 w-[13.377px]" style={{ backgroundImage: "linear-gradient(125.7235440921163deg, rgb(197, 211, 221) 24.576%, rgb(118, 135, 145) 100%)" }} />
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            <p className="leading-[normal]">Registros</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents left-[20px] top-[18.18px]" data-name="Mask group">
      <div className="absolute h-[57.588px] left-[22.39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.389px_-5.573px] mask-size-[243.358px_65.815px] top-[23.76px] w-[289.269px]" style={{ maskImage: `url("${imgImage16}")` }} data-name="image 16">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage17} />
      </div>
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="absolute contents left-[103.6px] top-[15px]" data-name="Mask group">
      <div className="absolute h-[57.588px] left-[22.39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[81.208px_-8.758px] mask-size-[212.838px_56.527px] top-[23.76px] w-[289.269px]" style={{ maskImage: `url("${imgImage18}")` }} data-name="image 17">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage19} />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute contents left-[20px] top-[15px]" data-name="Logo">
      <MaskGroup />
      <MaskGroup1 />
    </div>
  );
}

function PostIt() {
  return (
    <div className="absolute contents left-[161px] top-[138px]" data-name="postIt">
      <div className="absolute bg-[#f6e782] border-0 border-[#d6c24a] border-solid h-[132.342px] left-[161px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[#f7e05e] h-[29.684px] left-[161px] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[16.079px] left-[185px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[138px] w-[74.42px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] h-[48.237px] justify-center leading-[0] left-[221.39px] not-italic text-[#615d5d] text-[36px] text-center top-[252.64px] w-[59.78px]">
        <p className="leading-[20px]">01</p>
      </div>
      <div className="-translate-x-1/2 [word-break:break-word] absolute font-['Baloo_Paaji:Regular',sans-serif] h-[40.816px] leading-[0] left-[221.39px] not-italic text-[#615d5d] text-[16px] text-center top-[176.58px] w-[108.58px]">
        <p className="leading-[20px] mb-0">Prospectos</p>
        <p className="leading-[20px]">Registrados</p>
      </div>
    </div>
  );
}

function PostIt1() {
  return (
    <div className="absolute contents left-[370px] top-[138px]" data-name="postIt">
      <div className="absolute bg-[#f6e782] border-0 border-[#d6c24a] border-solid h-[132.342px] left-[370px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[#f7e05e] h-[29.684px] left-[370px] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[16.079px] left-[394px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[138px] w-[74.42px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] h-[48.237px] justify-center leading-[0] left-[430.39px] not-italic text-[#615d5d] text-[36px] text-center top-[252.64px] w-[59.78px]">
        <p className="leading-[20px]">02</p>
      </div>
      <div className="-translate-x-1/2 [word-break:break-word] absolute font-['Baloo_Paaji:Regular',sans-serif] h-[40.816px] leading-[0] left-[430.39px] not-italic text-[#615d5d] text-[16px] text-center top-[176.58px] w-[108.58px]">
        <p className="leading-[20px] mb-0">Contratos</p>
        <p className="leading-[20px]">Firmados</p>
      </div>
    </div>
  );
}

function PostIt2() {
  return (
    <div className="absolute contents left-[579px] top-[138px]" data-name="postIt">
      <div className="absolute bg-[#f6e782] border-0 border-[#d6c24a] border-solid h-[132.342px] left-[579px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[#f7e05e] h-[29.684px] left-[579px] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[16.079px] left-[603px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[138px] w-[74.42px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] h-[48.237px] justify-center leading-[0] left-[639.39px] not-italic text-[#615d5d] text-[36px] text-center top-[252.64px] w-[59.78px]">
        <p className="leading-[20px]">01</p>
      </div>
      <div className="-translate-x-1/2 [word-break:break-word] absolute font-['Baloo_Paaji:Regular',sans-serif] h-[40.816px] leading-[0] left-[639.39px] not-italic text-[#615d5d] text-[16px] text-center top-[176.58px] w-[108.58px]">
        <p className="leading-[20px] mb-0">Paquetes</p>
        <p className="leading-[20px]">de Radio</p>
      </div>
    </div>
  );
}

function PostIt3() {
  return (
    <div className="absolute contents left-[788px] top-[138px]" data-name="postIt">
      <div className="absolute bg-[#f6e782] border-0 border-[#d6c24a] border-solid h-[132.342px] left-[788px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[#f7e05e] h-[29.684px] left-[788px] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[16.079px] left-[812px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[138px] w-[74.42px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] h-[48.237px] justify-center leading-[0] left-[848.39px] not-italic text-[#615d5d] text-[36px] text-center top-[252.64px] w-[59.78px]">
        <p className="leading-[20px]">01</p>
      </div>
      <div className="-translate-x-1/2 [word-break:break-word] absolute font-['Baloo_Paaji:Regular',sans-serif] h-[40.816px] leading-[0] left-[848.39px] not-italic text-[#615d5d] text-[16px] text-center top-[176.58px] w-[108.58px]">
        <p className="leading-[20px] mb-0">Paquetes</p>
        <p className="leading-[20px]">de Periódico</p>
      </div>
    </div>
  );
}

function PostIt4() {
  return (
    <div className="absolute contents left-[997px] top-[138px]" data-name="postIt">
      <div className="absolute bg-[#f6e782] border-0 border-[#d6c24a] border-solid h-[132.342px] left-[997px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[#f7e05e] h-[29.684px] left-[997px] top-[145.66px] w-[122px]" />
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[16.079px] left-[1021px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[138px] w-[74.42px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] h-[48.237px] justify-center leading-[0] left-[1057.39px] not-italic text-[#615d5d] text-[36px] text-center top-[252.64px] w-[59.78px]">
        <p className="leading-[20px]">02</p>
      </div>
      <div className="-translate-x-1/2 [word-break:break-word] absolute font-['Baloo_Paaji:Regular',sans-serif] h-[40.816px] leading-[0] left-[1057.39px] not-italic text-[#615d5d] text-[16px] text-center top-[176.58px] w-[108.58px]">
        <p className="leading-[20px] mb-0">Ventas</p>
        <p className="leading-[20px]">Totales</p>
      </div>
    </div>
  );
}

export default function Menu() {
  return (
    <div className="bg-[#3a2422] relative size-full" data-name="MENU">
      <div className="absolute bg-[#615d5d] border-3 border-[#1e1e1e] border-solid h-[240px] left-[100px] rounded-[7px] shadow-[10px_0px_10px_0px_rgba(0,0,0,0.25)] top-[80px] w-[1080px]" />
      <div className="absolute bg-[#f8f4e3] h-[50px] left-0 top-[670px] w-[1280px]" />
      <div className="absolute bg-[#f8f4e3] h-[203px] left-[133px] rounded-bl-[15px] rounded-br-[15px] top-[90px] w-[178px]" />
      <div className="absolute bg-[#f8f4e3] h-[203px] left-[342px] rounded-bl-[15px] rounded-br-[15px] top-[90px] w-[178px]" />
      <div className="absolute bg-[#f8f4e3] h-[203px] left-[969px] rounded-bl-[15px] rounded-br-[15px] top-[90px] w-[178px]" />
      <div className="absolute bg-[#f8f4e3] h-[203px] left-[760px] rounded-bl-[15px] rounded-br-[15px] top-[90px] w-[178px]" />
      <div className="absolute bg-[#f8f4e3] h-[203px] left-[551px] rounded-bl-[15px] rounded-br-[15px] top-[90px] w-[178px]" />
      <div className="absolute bg-[#008a52] h-[100px] left-0 top-0 w-[1280px]" />
      <ModuloDeRegistros className="absolute bg-gradient-to-b from-[#7cc91a] h-[126px] left-[651px] rounded-[10px] to-[#1ba547] top-[354px] w-[253px]" />
      <p className="[word-break:break-word] absolute font-['Lilita_One:Regular',sans-serif] leading-[normal] left-[calc(50%-128px)] not-italic text-[40px] text-white top-[27px] whitespace-nowrap">Menú de Inicio</p>
      <div className="absolute bg-[#f7e05e] border border-[#c8c135] border-solid h-[31px] left-[160px] rounded-bl-[15px] rounded-br-[15px] top-[100px] w-[960px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] left-[639.5px] not-italic text-[#615d5d] text-[20px] text-center top-[115px] whitespace-nowrap">
        <p className="leading-[20px]">Mis registros de la semana</p>
      </div>
      <Logo />
      <PostIt />
      <PostIt1 />
      <PostIt2 />
      <PostIt3 />
      <PostIt4 />
      <ModuloDeSeguimientoACliente className="absolute bg-gradient-to-b cursor-pointer from-[#1edae0] h-[126px] left-[376px] rounded-[10px] to-[#0b6e77] top-[354px] w-[253px]" />
      <button className="absolute cursor-pointer left-[1020px] top-[20px]" data-name="Botón de Vendedor">
        <div className="content-stretch flex items-start relative size-full">
          <div className="bg-[#00663b] h-[60px] relative rounded-[10px] shrink-0 w-[210px]" data-name="Botones">
            <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex gap-[10px] items-center justify-center px-[36px] py-[30px] relative size-full">
                <div className="relative shrink-0 size-[51px]" data-name="account (1) 2">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAccount12} />
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Baloo_Paaji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[25px] text-left text-white whitespace-nowrap">
                  <p className="leading-[normal]">Adriana</p>
                </div>
                <div className="relative shrink-0 size-[27px]" data-name="down 2">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDown2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
      <ModuloDeNuevoProspecto className="absolute bg-gradient-to-b from-[#20c25e] h-[126px] left-[100px] rounded-[10px] to-[#079968] top-[354px] w-[253px]" />
      <ModuloDeAgenda className="absolute bg-gradient-to-b from-[#6464f0] h-[126px] left-[927px] rounded-[10px] to-[#7b3dee] top-[354px] w-[253px]" />
      <ModuloDeSalir className="absolute bg-gradient-to-b from-[#da2527] h-[126px] left-[927px] overflow-clip rounded-[10px] to-[#bf133b] top-[504px] w-[253px]" />
      <ModuloDePaquetesDePeriodico className="absolute bg-gradient-to-b from-[#fa8c3c] h-[126px] left-[100px] rounded-[10px] to-[#ef4743] top-[504px] w-[253px]" />
      <ModuloDePaquetesDeRadio className="absolute bg-gradient-to-b from-[#0059ff] h-[126px] left-[376px] rounded-[10px] to-[#003699] top-[504px] w-[253px]" />
      <ModuloDeEditarPendientes className="absolute bg-gradient-to-b from-[#fac73c] h-[126px] left-[651px] rounded-[10px] to-[#ef4743] top-[504px] w-[253px]" />
    </div>
  );
}