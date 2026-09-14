# Redesign do calendário da Agenda

## Resumo

O calendário da `/dashboard/agenda` estava com cores do CSS padrão do react-big-calendar (dias fora
do mês cinza claro, "hoje" azul claro, eventos azuis) mesmo no tema escuro. O tema foi corrigido e o
visual refinado em todas as visões (Mês, Semana, Dia, Agenda).

## Arquivos alterados

- `app/dashboard/agenda/_components/calendar-theme.css`
- `app/dashboard/agenda/_components/calendar-toolbar.tsx`
- `app/dashboard/agenda/page.tsx`

## Bug corrigido

Sintoma: no tema escuro, células de fora do mês ficavam `#e6e6e6`, o dia atual `#eaf6ff` e os eventos
`#3174ad`.

Causa: `calendar-theme.css` era importado antes de `react-big-calendar.css`; com a mesma
especificidade, o CSS da lib vencia.

Correção: todo o tema passou a ficar sob o wrapper `.izi-calendar` (no `page.tsx`), o que vence a lib
independente da ordem dos imports. O popup "+N mais" usa `body .rbc-overlay`, porque pode ser
renderizado fora do wrapper.

## Alterações

- Grade do mês com linhas mais suaves, dias fora do mês levemente apagados, hover nas células.
- Número do dia alinhado à esquerda, sem zero à esquerda; o dia atual vira uma pílula preenchida.
- Eventos em chip neutro com barra lateral na cor do texto (monocromático, funciona nos dois temas).
- Cabeçalho dos dias abreviado (`dom`, `seg`...). O `EEE` do date-fns pt-BR devolve o nome inteiro,
  por isso a abreviação é feita com `slice(0, 3)`.
- Semana/Dia: horários `HH:mm`, slots tracejados, rolagem inicial às 07:00 (`scrollToTime`).
- Agenda (lista): cabeçalho, espaçamento e hover por linha.
- Toolbar: navegação agrupada num controle só e seletor de visão segmentado com `aria-pressed`.

## Decisões

- Qualquer regra nova do calendário deve ficar sob `.izi-calendar` para não perder para o CSS da lib.
- Cores só via tokens do app (`--foreground`, `--border`, `--muted`...) com `color-mix`, sem hex fixo.

## Estado atual

Validado visualmente em claro e escuro com eventos de exemplo (mês, popup "+N mais", semana e agenda).
`tsc --noEmit` e lint da pasta limpos.

## Pendências

- Nenhuma.
