> Este arquivo e **gerado automaticamente** pelo CI a cada push na branch `main`.
> Nao edite a mao: o proximo commit do CI sobrescreve. Para ver a rodada no Actions:
> https://github.com/ORG/REPO/actions/workflows/pam-ci.yml

## Nota PAM I — TechControl (equipamentos)

![](https://img.shields.io/static/v1?label=Nota%20PAM%20I&message=MB&color=green)

**Nota atual: MB** · 91% (91/100 pontos) · rodada de 2026-11-10 01:28:30 · commit `local`

Legenda: I = Insuficiente (0–25%) · R = Regular (25–50%) · B = Bom (50–75%) · MB = Muito bom (75–100%)

| Fase | Peso | Pontos | Situação |
|---|---|---|---|
| Fase 1 — Estrutura | 1x (10 pts) | 10/10 | completa |
| Fase 2 — AsyncStorage | 1x (15 pts) | 15/15 | completa |
| Fase 3 — SQLite | 2x (30 pts) | 30/30 | completa |
| Fase 4 — Versão Final (SQLite + UX + Dispositivo) | 3x (45 pts) | 36/45 | em desenvolvimento |

## Resumo dos Testes Funcionais (Execução Real em Runtime Node + SQLite)

| Teste Funcional SQLite (Fase 4) | Resultado | Detalhes da Execução |
|---|---|---|
| Schema / Inicialização (`CREATE TABLE`) | PASSOU | Tabelas criadas no SQLite: `equipments` |
| Adicionar (`INSERT INTO`) | PASSOU | Inserção SQLite verificada em memória (`inserts=2` em `equipments`) |
| Listar + Filtrar (`SELECT` + `WHERE`) | PASSOU | Leitura e filtro SQLite verificados (`selects=6, where=7`) |
| Editar (`UPDATE`) | PASSOU | Atualização SQLite verificada (`updates=2` em `equipments`) |
| Excluir (`DELETE FROM`) | PASSOU | Exclusão SQLite confirmada (`deletes=2` em `equipments`) |

## Checklist validado

### Fase 1 — Estrutura do projeto (10/10 pts · peso 1x)

- [x] **(+1 pts)** README.md existe e fala do projeto/grupo — `README.md`
- [x] **(+1 pts)** Arquivo principal do app existe (App.js) — `App.js`
- [x] **(+1 pts)** package.json existe com a dependência "expo" — `expo ~58.0.22`
- [x] **(+1 pts)** Existe tela de LISTAGEM — `src/screens/EquipmentListScreen.js`
- [x] **(+1 pts)** Existem dados iniciais (seed) em arquivo de dados — `src/data/equipments.js`
- [x] **(+1 pts)** Existe tela de FORMULÁRIO — `src/screens/EquipmentFormScreen.js`
- [x] **(+1 pts)** Existe tela de DETALHE — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Dependências importadas existem no package.json (app não quebra ao abrir) — `todos os imports resolvem`
- [x] **(+1 pts)** app.json identifica o app (name/slug preenchidos) — `app.json`
- [x] **(+1 pts)** Projeto tem pelo menos 2 arquivos de tela/código — `4 arquivos de tela`

### Fase 2 — Persistência com AsyncStorage (15/15 pts · peso 1x)

- [x] **(+1 pts)** Dependência async-storage está no package.json (ou migrado p/ expo-sqlite) — `no package.json`
- [x] **(+1 pts)** Existe import do AsyncStorage (ou SQLite) no código — `src/database/database.js`
- [x] **(+1 pts)** Storage faz leitura (AsyncStorage.getItem ou SELECT) — `src/database/database.js`
- [x] **(+1 pts)** Storage grava dados (AsyncStorage.setItem ou INSERT) — `src/database/database.js`
- [x] **(+1 pts)** Existe função de CARREGAR a lista (carregar/load/listar/get) — `App.js`
- [x] **(+1 pts)** Existe função de ADICIONAR/CADASTRAR (adicionar/salvar/inserir/create) — `src/database/database.js`
- [x] **(+1 pts)** Existe busca por id (buscar/find/getItem/getFirst) — `src/database/database.js`
- [x] **(+1 pts)** Existe função de EXCLUIR/remover — `src/database/database.js`
- [x] **(+1 pts)** Formulário lê entradas com TextInput — `src/screens/EquipmentFormScreen.js`
- [x] **(+1 pts)** Formulário salva chamando adicionar/salvar — `src/screens/EquipmentFormScreen.js`
- [x] **(+1 pts)** Lista é alimentada a partir do storage/banco — `src/screens/EquipmentListScreen.js`
- [x] **(+1 pts)** Tela de detalhe usa busca/dados do storage/banco — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Exclusão usa confirmação (Alert.alert) — `src/screens/EquipmentDetailScreen.js`
- [x] **(+1 pts)** Dados iniciais/seed são gravados na 1ª execução — `src/database/database.js`
- [x] **(+1 pts)** Formulário valida campos (trim/length/vazio) — `src/screens/EquipmentFormScreen.js`

### Fase 3 — Banco de dados SQLite (30/30 pts · peso 2x)

- [x] **(+2 pts)** Dependência expo-sqlite está no package.json — `no package.json`
- [x] **(+2 pts)** Existe import do expo-sqlite — `src/database/database.js`
- [x] **(+2 pts)** Existe arquivo de banco de dados — `src/database/database.js`
- [x] **(+2 pts)** Cria a tabela com CREATE TABLE IF NOT EXISTS — `src/database/database.js`
- [x] **(+2 pts)** Insere dados com INSERT INTO — `src/database/database.js`
- [x] **(+2 pts)** Consulta com SELECT — `src/database/database.js`
- [x] **(+2 pts)** Atualiza com UPDATE — `src/database/database.js`
- [x] **(+2 pts)** Exclui com DELETE FROM — `src/database/database.js`
- [x] **(+2 pts)** Usa filtros com WHERE — `src/database/database.js`
- [x] **(+2 pts)** Banco aberto com openDatabaseAsync/openDatabaseSync/openDatabase — `src/database/database.js`
- [x] **(+2 pts)** Tela de lista carrega dados do banco — `src/screens/EquipmentListScreen.js`
- [x] **(+2 pts)** Formulário salva no banco (INSERT/runAsync/runSync) — `src/screens/EquipmentFormScreen.js`
- [x] **(+2 pts)** Detalhe busca no banco com WHERE/SELECT — `src/screens/EquipmentDetailScreen.js`
- [x] **(+2 pts)** Usa async/await corretamente (mais de 2 await) — `src/database/database.js`
- [x] **(+2 pts)** Banco possui dados iniciais (seed inserido em SQL) — `src/database/database.js`

### Fase 4 — Versão Final: SQLite Exclusivo, UX, Dispositivo e Entrega (36/45 pts · peso 3x)

- [x] **(+3 pts)** SQLite exclusivo: fluxo das telas usa SQLite sem depender de AsyncStorage p/ dados críticos — `src/database/database.js (telas sem AsyncStorage crítico)`
- [x] **(+3 pts)** [Teste Funcional SQLite] Banco abre e cria a(s) tabela(s) em memória (CREATE TABLE) — `Tabela(s) criada(s) no motor SQLite: equipments`
- [x] **(+3 pts)** [Teste Funcional SQLite] Fluxo de ADICIONAR insere registro real no banco (INSERT INTO) — `INSERT executado com sucesso no SQLite (2 inserção/ões em equipments)`
- [x] **(+3 pts)** [Teste Funcional SQLite] Fluxo de LISTAR e FILTRAR retorna dados reais (SELECT + WHERE) — `SELECT (6x) + WHERE (7x) validados em equipments`
- [x] **(+3 pts)** [Teste Funcional SQLite] Fluxo de EDITAR atualiza registro existente no banco (UPDATE) — `UPDATE executado e verificado no SQLite (2x em equipments)`
- [x] **(+3 pts)** [Teste Funcional SQLite] Fluxo de EXCLUIR remove registro do banco (DELETE FROM) — `DELETE executado e confirmado no SQLite (2x em equipments)`
- [ ] **(+3 pts)** Recurso do dispositivo: pacote nativo no package.json (notifications, image-picker, location) ou justificativa — `FALTA instalar expo-notifications / expo-image-picker / expo-location (ou justificar no README)`
- [ ] **(+3 pts)** Recurso do dispositivo: uso da API nativa no código (notificação, foto ou GPS) ou justificativa — `FALTA integrar recurso do aparelho no código (Aulas 08, 09 ou 10)`
- [x] **(+3 pts)** UX: Loading ao carregar a lista do SQLite (ActivityIndicator + estado loading/carregando) — `App.js (src/screens/EquipmentListScreen.js)`
- [x] **(+3 pts)** UX: Empty State quando não houver registros (mensagem amigável + ícone/emoji/ilustração) — `src/screens/EquipmentListScreen.js`
- [x] **(+3 pts)** UX: Mensagem de erro amigável se falhar ao CARREGAR dados (try/catch com feedback) — `src/database/database.js`
- [x] **(+3 pts)** UX: Mensagem de erro amigável e validação se falhar ao SALVAR/EXCLUIR (try/catch + Alert/.trim) — `src/database/database.js + validação .trim()`
- [x] **(+3 pts)** Organização do código: separação em pastas por responsabilidade (screens/app, database/data, components) — `pastas: components, data, database, screens`
- [x] **(+3 pts)** Interface consistente: FlatList (keyExtractor + renderItem) e estilização StyleSheet.create — `src/screens/EquipmentListScreen.js (6 arquivos com StyleSheet)`
- [ ] **(+3 pts)** Entrega: repositório limpo (.gitignore sem node_modules) e README com instruções/Expo Go/APK — `FALTA .gitignore ou documentar como rodar/testar (Expo Go/APK) no README.md`

## Para evoluir a nota

Os itens **desmarcados** acima são exatamente o que falta no projeto. Cada rodada deste CI (a cada push) executa os testes estáticos e funcionais, recalcula e atualiza a nota — o artefato `nota-pam` sempre mostra o valor mais recente.
