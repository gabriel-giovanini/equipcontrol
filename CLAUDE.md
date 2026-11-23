# EquipControl — diretrizes para o Claude

App escolar de controle de equipamentos em **Expo / React Native** (roda no celular via Expo Go e na web via `expo start --web`). Persistência em SQLite (`src/database/database.js`).

## Regra principal: mudanças de visual não tocam na lógica

Ao refazer o visual, altere **apenas apresentação e animações**. Rotas (`EquipmentList`, `EquipmentDetail`, `EquipmentForm`, `Confirmation`), nomes de campos, IDs, chamadas ao banco, validações, regras de negócio e fluxos ficam exatamente iguais. Se algo exigir mexer em lógica, **pare e pergunte** ao dono do projeto.

Não faça commit nem push sem aprovação explícita.

## Não quebre o CI de nota (`.github/scripts/pam-ci.mjs`)

O CI lê o código com regex. O que precisa continuar existindo:
- `Alert.alert` na confirmação de exclusão (EquipmentDetailScreen) e nos `catch` de salvar/excluir.
- `ActivityIndicator` controlado por estado de loading na lista.
- `FlatList` com `keyExtractor` e `renderItem`.
- `StyleSheet.create` em pelo menos 2 arquivos.
- Os 4 arquivos de tela em `src/screens/`, além de `src/data/equipments.js` e `App.js`.
- Todo import novo declarado no `package.json`.

## Estética: painel escuro premium (estilo Money Sync)

**Cores e superfícies**
- Fundo `#0c0a09` com brilho radial no canto, na cor do item em destaque. O dono do projeto pediu que ele seja **bem discreto** (pico de opacity ~.07): não deixar o brilho forte de novo.
- Painéis `rgba(255,255,255,.035)`, borda `rgba(255,255,255,.08)`, raio 1.5rem (24px).
- Granulado SVG feTurbulence (opacity .08) sobre os degradês.
- Nada de gradiente roxo-azul genérico, nada de emojis, nada de ✨.

**Tipografia**
- Montserrat (500–900) em títulos, números e logo; DM Sans nos textos.
- Títulos: Montserrat 800, clamp(2.1rem, 3.7vw, 4.4rem), line-height 1.02, letter-spacing -0.02em, em 2 linhas curtas, com a segunda linha em branco 45%.
- Kicker: Montserrat 700, 12px, maiúsculas, letter-spacing .25em.
- Rótulos de formulário: Montserrat 700, 11px, maiúsculas, letter-spacing .14em, branco 50%.
- Números: tabular-nums.

**Layout**
- Sidebar com pílula branca que desliza com mola até o item ativo e cartão do usuário no rodapé. No celular, a sidebar vira gaveta.
- Topo com título + subtítulo, busca (atalho `/`) e botão primário branco com seta.
- Funcionar em 375px sem rolagem horizontal.

**Botões**
- Primário: branco com texto escuro e seta. O gap aumenta no hover e há scale .95 no clique.
- Secundário: vidro sutil.

**Card de destaque**
- Degradê radial vibrante: `radial-gradient(110% 85% at 50% 45%, c1, c2 40%, c3)`.
- Ilustração 3D flutuante do tipo de equipamento. Ela levita (0 → -22px → 0, 4.2s) e tem uma sombra no chão que encolhe e clareia quando ela sobe.
- Tilt com o mouse (perspective 1300px).
- Setas < > trocam de categoria: o item sai girando, o novo entra com elastic.out(1, .62), a cor de fundo transiciona e os números fazem contagem animada.

**Status**
- Status (Disponível, Em uso, Emprestado, Em manutenção…) aparece como bolinha de 8px na cor + texto normal.
- NUNCA texto estático dentro de pílula/cápsula com fundo.

**Movimento**
- Entrada das telas: elementos sobem em stagger (y 26 → 0, .7s, power3.out).
- Modais entram com mola e fecham com Esc ou clique fora. Toasts: pílula branca no rodapé. Switches com mola.
- Estados vazios com ilustração flutuante e uma ação clara.
- Anime só transform e opacity.
- Respeite prefers-reduced-motion, desligando só a levitação e o tilt.
- Animação: GSAP 3.12.5 via cdnjs foi pedido, mas o app é React Native; veja a decisão registrada abaixo.

## Decisões de stack (confirmadas pelo dono do projeto)

- **Animações:** API `Animated` do React Native (molas com `Animated.spring`, `useNativeDriver` onde suportado), no lugar de GSAP/cdnjs. Funciona igual no celular e na web.
- **Pacotes visuais permitidos:** `expo-font`, `@expo-google-fonts/montserrat`, `@expo-google-fonts/dm-sans`, `expo-linear-gradient`, `react-native-svg`. Degradê radial, granulado e ilustrações 3D são feitos em SVG.
- **Nada de lógica nova:** sem busca, sem agrupamento ou filtro por categoria e sem cartão de usuário com dados falsos. A sidebar/gaveta só leva às rotas que já existem (lista e novo cadastro). As setas < > do card de destaque só trocam qual equipamento já carregado aparece, como estado local de UI.
