# Pendências de conteúdo — portfolio

> Inventário do que o vault massCode (`C:\Users\Lucas\massCode\markdown-vault`) e o cruzamento com este repo sugerem incluir ou melhorar.
> Criado em 2026-09-23. **Não** importar snippets crus, secrets, SQL/CRM, cookies Jira ou fixtures KYC.
> Fonte canônica de fatos: `curriculum/career/professional-profile.md` (atualizar lá antes de refletir no portfolio público).

Status: `pendente` · `em progresso` · `feito` · `descartado` (com motivo)

---

## 1. Métrica HWB

| Campo | Valor |
|-------|--------|
| Status | pendente (Lucas vai localizar / confirmar depois) |
| Onde no portfolio | `index.html` seção Metrics (ao lado de PPI / SRM / RBD / Task Score), se confirmada |
| Origem | massCode `code/QA Metrics/HWB.md` (função `computeHWB` comentada) |
| Gap | Ausente no portfolio e no `professional-profile.md` |
| Checagem TCC | **Não** está no TCC final (`TCC Empresa - Lucas Ferreira da Silva - Versão Final.pdf`, 55 págs.). “Workload” no TCC é retrabalho Jira (BugType/RootCause/Environment), outra coisa. PPI/SRM/RBD também não estão no TCC. |

**Fórmula (rascunho no vault):**

```
HWB = ((minor + info) / codelines)
    + ((critical + major) / (codelines / 1000))
    + blocker
    + vulnerability
    + securityHotspot
```

Entradas tipicamente alinhadas a issues Sonar (severidade + security hotspot) normalizadas por linhas de código. Acrônimo **não** expandido em nenhuma fonte encontrada.

**Antes de publicar:** Lucas confirma se foi (A) métrica usada/reportada, (B) só rascunho/estudo, ou (C) descartar. Até lá, não gravar no `professional-profile.md` nem no portfolio.

---

## 2. Visual testing — Figma / Perfect Pixel / Percy

| Campo | Valor |
|-------|--------|
| Status | pendente (pulado por agora; retomar depois) |
| Onde no portfolio | Card CLP + bullets de experience; OSS já ok com Percy |
| Gap | Portfolio mistura Figma + tag Percy sem Perfect Pixel; perfil junta os três numa frase |

**O que cada fonte diz hoje**

| Camada | Perfil canônico | Portfolio | Vault massCode |
|--------|-----------------|-----------|----------------|
| **Figma** | Conformidade vs specs | Bullet Questrade + card CLP | (não) |
| **Perfect Pixel** | Processo formal: pixel-a-pixel (breakpoints, fonte, cor, tema, i18n) + DoR/DoD por componente | **Ausente** | (não) |
| **Percy** | Ferramenta de visual regression; OSS testflow-cypress | Tag no card CLP + OSS explícito | Goals 2024: “Percy: create a PoC”; pasta `Percy/Token.md` (credencial, não importar) |

**Ambiguidades a fechar com Lucas**

1. Perfect Pixel foi processo real do time CLP (DoR/DoD) ou só nome de CV antigo?
2. Percy na Questrade: PoC feito, adotado em CI, ou só meta 2024 / só OSS?
3. A tag Percy no card CLP do portfolio implica emprego ou vazou do OSS?

**Melhoria (depois da confirmação):** texto curto que separe processo (Perfect Pixel / Figma), Percy no emprego (se houver), e demo OSS (`testflow-cypress` / `testflow-percy`).

---

## 3. Looker Studio Quality Report (números + KT)

| Campo | Valor |
|-------|--------|
| Status | feito (2026-09-23): bloco Looker em `index.html` #metrics + `growth.html` (ls8 / chip 2023) |
| Onde no portfolio | Seção Metrics (`index.html`) + amarrar ao “quality report” de `growth.html` |
| Já existe no portfolio | Uma linha: “visualized via Grafana / Looker Studio”; growth fala do quality report só de forma qualitativa (visibilidade cross-team, QA Talk) |
| Já existe no perfil | Canônico e completo |

**Números canônicos (perfil §4.1 / §8), ausentes no portfolio:**

| Dado | Valor |
|------|-------|
| Ferramenta | Google Looker Studio |
| Casos de teste rastreados | **373** |
| % automatizados | **27,9%** |
| Projetos na pirâmide | **5** |
| Sprints consecutivos de Quality Report | **5+** |
| Conteúdo típico do report | bug ratio por ticket, PPI, sprint achievement, cobertura da pirâmide |
| Evolução | planilha → Grafana/InfluxDB → Looker Studio Quality Reports |
| Extra | Looker Customer Lifecycle Dashboard (além do Quality Report por sprint) |

**Vault / Goals:** KT “como criar quality report com Looker Studio” era meta pessoal 2024; growth já cita QA Talk de métricas como exemplo a replicar.

**Opções de melhoria (sem inventar):**

1. No `index.html` (Metrics): bloco curto “Quality Reports (Looker Studio)” com os números acima + link/contexto ao growth.
2. No `growth.html`: trocar “a quality report” genérico por “Looker Studio Quality Report” e, se couber, 373 TCs / 27,9%.
3. Só curriculum: nada a fazer (já documentado).

**Não** publicar nomes de squads/clientes além do já sanitizado (“4 squads” no perfil).

---

## 4. Datadog — alerts / RCA (além de load)

| Campo | Valor |
|-------|--------|
| Status | descartado (2026-09-23) |
| Motivo | Lucas confirmou: era **só meta** (Goals 2024), não entrega concreta. Não inventar case no portfolio nem reforçar claim além do que o perfil já tem com cuidado. |
| Onde no portfolio | (não alterar) |
| Já existe (manter) | Datadog em load (k6) e chip de observability; perfil já cita cobertura de alarmes de forma genérica |

**Não publicar** narrativa de “revisão de thresholds / limpeza de logs / RCA de alerts” como case fechado.

---

## 5. Case sanitizado — tax residency / residential address

| Campo | Valor |
|-------|--------|
| Status | descartado (2026-09-23) |
| Motivo | Lucas: irrelevante para o portfolio público. Matriz fica só no vault / uso privado de entrevista se precisar; não publicar card nem bloco no site. |
| Onde no portfolio | (não alterar) |

---

## 6. KYC Annual Review — mapa de fluxo (sanitizado)

| Campo | Valor |
|-------|--------|
| Status | descartado (2026-09-23) |
| Motivo | Lucas: não é útil no portfolio. Annual Review já aparece por nome (experience/recommendation); mapa de steps do vault não publica. |
| Onde no portfolio | (não alterar) |

---

## 7. Schema InfluxDB (campos da coleta)

| Campo | Valor |
|-------|--------|
| Status | feito (2026-09-23): bloco sob Architecture do qametrics em `index.html` `#qametrics-influx-fields` |
| Onde no portfolio | Card qametrics OSS: depois do diagrama Newman → InfluxDB → Grafana, antes do Test Reader |
| Origem | massCode `QA Metrics/InfluxDB.md` (campos de negócio; ids internos omitidos) |

---

## 8. Goals 2024 — itens soltos (só se confirmados)

| Campo | Valor |
|-------|--------|
| Status | pendente (pulado de novo 2026-09-23; sem ação até confirmação) |

| Item | Status sugerido | Nota |
|------|-----------------|------|
| PoC Percy na Questrade | pendente | Ver §2 |
| Comparação Playwright vs Cypress como iniciativa | pendente | Playwright MFA já está; falta framing de “estudo/comparação” |
| Meta certificação GCP (ACE / Cloud Developer) | pendente / possível descartado | Não alegar cert; opcional “estudo planejado” se ainda válido |
| CTFL | parcialmente feito | `certification.html` já documenta prep; não listar como certificado obtido |
| PI Planning / ownership de docs | baixa | Só se houver fato concreto além do que growth/experience já cobrem |

---

## 9. Vault médios descartados (2026-09-23)

| Origem | Motivo |
|--------|--------|
| `Grafana/Variables.md` | Cheatsheet da doc oficial; Grafana já coberto |
| `OAA/E2E.md` | Cola Filip Hric / plugins; pasta OAA sem fato de domínio |
| `Cypress/*` (`Annual Income`, `options`, `Cypress Grep`, `Curso TAT`) | HTML interno / cola operacional / curso; Cypress Cloud já no CLP |

---

## Explicitamente fora de escopo (não incluir)

- `Questrade/JIRA Post.md` (cookies/JWT)
- SQL CRM, UPDATEs, CustomerUUID, e-mails/telefones internos
- `Percy/Token.md` e prerequests com segredos
- Fixtures KYC/PEP (`QA/profile.md`, `Bugs/`, `Nune (QA)/`)
- `Personal/*`, férias, gastos
- Feature flags internas Thanos (“Enable KYC Force”, etc.) sem sanitização forte

---

## Ordem de trabalho sugerida

1. HWB (confirmar uso → perfil canônico → card no portfolio)
2. Visual testing (Figma / Perfect Pixel / Percy)
3. Looker Quality Report (+ Datadog alerts se confirmado)
4. Cases sanitizados tax residency / KYC Annual
5. Schema InfluxDB e Goals soltos (opcional)

Cada item: atualizar status nesta lista ao concluir.
