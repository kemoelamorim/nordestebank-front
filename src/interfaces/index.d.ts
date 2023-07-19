export interface IConta {
  id: number,
  titular: string;
  tipoConta: ITipoConta;
  cpfCnpj: string;
  email: string;
  dddTelefone: string;
}
export type ITipoConta = "FISICA" | "JURIDICA";

export interface IEndereco {
  id: number,
  tipoEndereco: ITipoEndereco,
  cep: string,
  logradouro: string,
  numero: string,
  bairro: string,
  localidade: string,
  uf: string,
  complemento: string
}

export type ITipoEdereco = "RESIDENCIAL" | "COMERCIAL";