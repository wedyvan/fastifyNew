export const confirmarLeito = {
  "description": "Cria uma nova solicitação",
  "tags": ["solicitacao"],
  "body": {
    "type": "object",
    "properties": {
      "cd_solicitacao": {
        "type": "number",
        "description": "Código da solicitação"
      },
      "cd_tpLimpeza": {
        "type": "number",
        "description": "Código do tipo de limpeza"
      },
      "cd_funcionario": {
        "type": "number",
        "description": "Código do funcionário responsável"
      }
    },
    "required": ["cd_solicitacao", "cd_tpLimpeza", "cd_funcionario"],
  }
}
