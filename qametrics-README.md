# QA Metrics

Open-source Docker stack that unifies **Jira**, **SonarCloud** and **Test Pyramid** metrics into **Grafana** dashboards — undergraduate thesis (UFRPE · Company modality · 2022).

QAs spent 1–3 hours per sprint manually copying metrics into spreadsheets and Slides. This project reduces that to **~1 minute per pod** (**99.86%** time saved across 4 pods · **10h → 4 min** per sprint).

## Impact

- **99.86% time saved** · 10h → 4 min (4 pods per sprint)
- **3 dashboards** · Jira · Sonar · Pyramid
- **30–60s startup** · any team member can run metrics

## Architecture

```
Jira / SonarCloud APIs ──► Newman (Postman) ──► InfluxDB ──► Grafana (:3000)
Test Reader (semi-manual) ──┘
```

## Dashboards

### Jira

![Jira Dashboard](resources/grafana/jira.png)

### Pyramid

![Pyramid Dashboard](resources/grafana/pyramid.png)

### Sonar

![Sonar Dashboard](resources/grafana/sonar.png)

## Stack

- Docker · Docker Compose
- Grafana · InfluxDB
- Newman · Postman
- Jira · SonarCloud

## Quick start

### Requirements

- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/install)

Generate API tokens and update [newman/qametrics.postman_environment.json](newman/qametrics.postman_environment.json):

- [SonarCloud](README_SONAR.md)
- [Jira (Atlassian)](README_JIRA.md)
- [Test Pyramid](README_PYRAMID.md)

### Run

```shell
git clone https://github.com/lflucasferreira/qametrics.git
cd qametrics
docker-compose up
```

Open [localhost:3000](http://localhost:3000) — no login required to view dashboards.

### Stop

```shell
docker-compose down
```

### Refresh metrics

```shell
docker-compose restart newman
```

## JIRA_FILTER

Update the sprint date range in the `JIRA_FILTER` environment variable each sprint. Escape strings when needed ([onlinestringtools.com/escape-string](https://onlinestringtools.com/escape-string)).

## Thesis

Full technical report (PT): [UFRPE Arandu](https://arandu.ufrpe.br/items/cbdbc033-9b21-41bf-bba4-402ac689dd13)

## Author

Lucas Ferreira · [@lflucasferreira](https://github.com/lflucasferreira)
