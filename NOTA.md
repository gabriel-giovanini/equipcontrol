> Este arquivo e **gerado automaticamente** pelo CI a cada push na branch `main`.
> Nao edite a mao: o proximo commit do CI sobrescreve. Para ver a rodada no Actions:
> https://github.com/gabriel-giovanini/equipcontrol/actions/workflows/pam-ci.yml

## Nota PAM I — TechControl (equipamentos)

![](https://img.shields.io/static/v1?label=Nota%20PAM%20I&message=B&color=yellow)

**Nota atual: B** · 56% (31/55 pontos) · rodada de 2026-10-05 23:24:21 · commit `local`

Legenda: I = Insuficiente (0–25%) · R = Regular (25–50%) · B = Bom (50–75%) · MB = Muito bom (75–100%)

| Fase | Pontos | Situação |
|---|---|---|
| Fase 1 — Estrutura | 10/10 | completa |
| Fase 2 — AsyncStorage | 13/15 | em desenvolvimento |
| Fase 3 — SQLite | 8/30 | iniciando |

## Checklist validado

### Fase 1 — Estrutura do projeto (10/10 pts)

- [x] **(+1 pts)** README.md existe e fala do projeto/grupo — `README.md`
- [x] **(+1 pts)** Arquivo principal do app existe (App.js) — `App.js`
- [x] **(+1 pts)** package.json existe com a dependência "expo" — `expo ~57.0.18`
- [x] **(+1 pts)** Existe tela de LISTAGEM — `src/screens/EquipmentListScreen.js`
- [x] **(+1 pts)** Existem dados iniciais (seed) em arquivo de dados — `src/data/equipments.js`
- [x] **(+1 pts)** Existe tela de FORMULÁRIO — `src/screens/EquipmentFormScreen.js`
- [x] **(+1 pts)** Existe tela de DETALHE — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Dependências importadas existem no package.json (app não quebra ao abrir) — `todos os imports resolvem`
- [x] **(+1 pts)** app.json identifica o app (name/slug preenchidos) — `app.json`
- [x] **(+1 pts)** Projeto tem pelo menos 2 arquivos de tela/código — `4 arquivos de tela`

### Fase 2 — Persistência com AsyncStorage (13/15 pts)

- [x] **(+1 pts)** Dependência async-storage está no package.json — `no package.json`
- [x] **(+1 pts)** Existe import do AsyncStorage no código — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Storage faz leitura com AsyncStorage.getItem — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Storage grava com AsyncStorage.setItem — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Existe função de CARREGAR a lista (carregar/load) — `index.js`
- [ ] **(+1 pts)** Existe função de ADICIONAR/CADASTRAR — `—`
- [x] **(+1 pts)** Existe busca por id (buscar/find/getItem) — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Existe função de EXCLUIR/remover — `src/screens/EquipmentListScreen.js`
- [x] **(+1 pts)** Formulário lê entradas com TextInput — `src/screens/EquipmentFormScreen.js`
- [x] **(+1 pts)** Formulário salva chamando adicionar/salvar — `src/screens/EquipmentFormScreen.js`
- [x] **(+1 pts)** Lista é alimentada a partir do storage — `src/screens/EquipmentListScreen.js`
- [x] **(+1 pts)** Tela de detalhe usa busca/dados do storage — `src/screens/EquipmentDetailScreen.js`
- [ ] **(+1 pts)** Exclusão usa confirmação (Alert.alert) — `—`
- [x] **(+1 pts)** Dados iniciais/seed são gravados na 1ª execução — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Formulário valida campos (trim/length/vazio) — `src/screens/EquipmentFormScreen.js`

### Fase 3 — Banco de dados SQLite (8/30 pts)

- [ ] **(+2x2 pts)** Dependência expo-sqlite está no package.json — `FALTA instalar: npx expo install expo-sqlite`
- [ ] **(+2x2 pts)** Existe import do expo-sqlite — `—`
- [ ] **(+2x2 pts)** Existe arquivo de banco de dados — `—`
- [ ] **(+2x2 pts)** Cria a tabela com CREATE TABLE IF NOT EXISTS — `—`
- [ ] **(+2x2 pts)** Insere dados com INSERT INTO — `—`
- [x] **(+2x2 pts)** Consulta com SELECT — `src/components/EquipmentCard.js`
- [ ] **(+2x2 pts)** Atualiza com UPDATE — `—`
- [ ] **(+2x2 pts)** Exclui com DELETE FROM — `—`
- [ ] **(+2x2 pts)** Usa filtros com WHERE — `—`
- [ ] **(+2x2 pts)** Banco aberto com openDatabaseAsync/openDatabase — `—`
- [x] **(+2x2 pts)** Tela de lista carrega dados do banco — `src/screens/EquipmentListScreen.js`
- [ ] **(+2x2 pts)** Formulário salva no banco (INSERT/runAsync) — `src/screens/EquipmentFormScreen.js`
- [x] **(+2x2 pts)** Detalhe busca no banco com WHERE/SELECT — `src/screens/EquipmentDetailScreen.js`
- [x] **(+2x2 pts)** Usa async/await corretamente (mais de 2 await) — `src/screens/EquipmentDetailScreen.js`
- [ ] **(+2x2 pts)** Banco possui dados iniciais (seed inserido em SQL) — `—`

## Para evoluir a nota

Os itens **desmarcados** acima são exatamente o que falta no projeto. Cada rodada deste CI (a cada push) recalcula e atualiza a nota — o artefato `nota-pam` sempre mostra o valor mais recente.
