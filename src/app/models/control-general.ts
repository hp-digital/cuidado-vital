import { DesplegableDTO } from "./depleglable";

export class ControlGeneralDTO
{
    Paciente !: string;
    FechaRegistro !: Date;
    Alergias !: string;
    Banno !: DesplegableDTO;
    Vestido !: DesplegableDTO;
    Wc !: DesplegableDTO;
    Movilidad !: DesplegableDTO;
    Continencia !: DesplegableDTO;
    Alimentacion !: DesplegableDTO;
    ResultadoEscalaKatz !: DesplegableDTO;
    DetalleResultadoKatz !: string;
    Temperatura !: string;
    Fc !: string;
    Fr !: string;
    PresionSistolica !: string;
    PresionDiastolica !: string;
    Saturacion !: string;
    Peso !: string;
    Talla !: string;
    Imc !: string;
    FechaHoy !: string;
    DiaSemana !: string;
    LugarEstamos !: string;
    NumeroTelefono !: string;
    DireccionCompleta !: string;
    CuantosAnios !: string;
    DondeNacio !: string;
    NombrePresidente !: string;
    PrimerApellidoMadre !: string;
    ValoracionMental !: DesplegableDTO;
    ValoracionMentalDetalle !: string;
    Caida !: DesplegableDTO;
    CaidaDetalle !: string;
    EstadoNutricional !: DesplegableDTO;
    EstadoNutricionalDetalle !: string;
    EstadoPsicosocial !: DesplegableDTO;
    EstadoPsicosocialDetalle !: string;
    EstadoVision !: DesplegableDTO;
    EstadoVisionDetalle !: string;
    EstadoAudicion !: DesplegableDTO;
    EstadoAudicionDetalle !: string;
    PlanTrabajo !: string;
}