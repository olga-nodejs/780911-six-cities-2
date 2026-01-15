# Как работать над проектом

⚠️ В проекте работает только бекэнд часть, фронтэнд не работает

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз Node.js**. Актуальная версия **Node.js\*\* указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

#### Запустить mock api

```bash
npm start:mock-api
```

mock api server доступен по ссылке http://localhost:4000/offers

## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.

## CLI интерфейс

Проект содержит встроенный CLI-инструмент для импорта данных, генерации mock-файлов и вывода служебной информации.  
CLI запускается через сценарий:

```bash
npm run ts ./src/main.cli.ts -- <команда> [аргументы]
```

Доступные команды

| Command                                                               | Functionality                                  | Command example                                                                                              |
| --------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| --help                                                                | Выводит справочную информацию по CLI.          | npm run ts ./src/main.cli.ts -- --help                                                                       |
| --version                                                             | Выводит номер версии утилиты.                  | npm run ts ./src/main.cli.ts -- --version                                                                    |
| --import <filepath> <dblogin> <dbpassword> <dbhost> <dbPort> <dbName> | Импортирует данные из TSV-файла в базу данных. | npm run ts ./src/main.cli.ts -- --import ./mocks/mock-data.tsv admin test localhost 27017 six-cities salt123 |
| --generate <n> <filepath> <url>                                       | Генерирует mock TSV-файл.                      | npm run ts ./src/main.cli.ts -- --generate 100 ./mocks/generated-data.tsv http://localhost:3000              |

### Импорт данных **--import**

Импортирует данные из TSV-файла в базу данных.

Параметры:
|argument | argument description |
|-------|---------|
|filepath| путь к TSV файлу|
| dblogin| логин для подключения к БД|
| dbpassword| пароль|
| dbhost| хост (например, localhost)|
| dbPort| порт базы данных|
| dbName| имя базы данных|
| dbName| salt|

### Генерация данных **--generate**

Параметры:
|argument | argument description |
|-------|---------|
| n | количество записей |
| filepath | путь, куда сохранить сгенерированный файл |
| url | url для загрузки данных (например, API или источник моков) |

## Архитектура проекта

Проект построен с использованием Onion Architecture с элементами Clean Architecture и DDD-подхода.
Основная цель архитектуры — разделение ответственности, слабая связанность модулей и удобство тестирования и расширения.

## Общие принципы

- Зависимости направлены внутрь — бизнес-логика не зависит от инфраструктуры

- Используется Dependency Injection (через inversify)

- Четкое разделение:

  -доменной логики

  -инфраструктуры

  - HTTP-слоя (REST API)

  - CLI-инструментов

- Используются DTO, RDO, Entity, Service, Controller как отдельные слои ответственности

## Слои архитектуры

1. Domain / Business Layer (ядро)

Расположен в src/shared/modules и src/shared/types.

Содержит:

- Entity — доменные модели (\*.entity.ts)

- Service interfaces — контракты бизнес-логики

- DTO — входные данные (валидация)

- RDO — выходные данные (Response Data Object)

- Enums / Types — типы предметной области

Пример:

```
shared/modules/offer
shared/modules/user
shared/modules/comment
shared/types
```

2. Application Layer

Отвечает за:

- реализацию бизнес-сценариев

- связывание доменной логики с инфраструктурой

Содержит:

- default-\*.service.ts — реализации сервисов

- DI-контейнеры (\*.container.ts)

- бизнес-правила

Пример:

```
shared/modules/offer/default-offer.service.ts
shared/modules/offer/offer.container.ts
```

3. Infrastructure Layer

Отвечает за работу с внешними системами.

Содержит:

- MongoDB клиент

- конфигурацию приложения

логирование

- файловую систему

- генерацию и чтение TSV

Примеры:

```
shared/libs/db-client
shared/libs/config
shared/libs/Logger
shared/libs/TSVFileReader
shared/libs/TSVFileWriter
shared/libs/OfferGenerator
```

4. REST API Layer

Расположен в src/rest и src/shared/libs/rest.

Отвечает за:

- HTTP API

маршрутизацию

- middleware

- обработку ошибок

- валидацию входных данных

Содержит:

- Controllers

- Middlewares

- Exception filters

- Base abstractions

Примеры:

```
rest/rest.application.ts
shared/libs/rest/controller
shared/libs/rest/middleware
shared/libs/rest/exception-filter
```

5. CLI Layer

Проект содержит встроенный CLI-интерфейс для служебных задач.

Расположен в:

```
src/cli
src/main.cli.ts
```

CLI поддерживает:

- импорт данных в БД

- генерацию mock-файлов

- вывод справочной информации

Каждая команда реализована как отдельный класс:

cli/commands/import.command.ts
cli/commands/generate.command.ts
cli/commands/help.command.ts
cli/commands/version.command.ts

Более подробно про команды можно прочитать выше в CLI интерфейс

6. Swagger / OpenAPI

Проект поддерживает Swagger (OpenAPI) для документирования REST API.

```
🔗: specification/specification.yml
```

Swagger:

- описывает доступные эндпоинты

- схемы запросов и ответов

- DTO и модели данных

## Структура модулей (shared/modules)

Каждый модуль предметной области имеет одинаковую структуру:

```
module-name/
├── dto/ # DTO с валидацией
├── rdo/ # Response Data Objects
├── type/ # Типы запросов и параметров
├── _.entity.ts # Entity (доменная модель)
├── _.service.ts # Реализация сервиса
├── _.interface.ts # Контракт сервиса
├── _.controller.ts # REST-контроллер
├── \*.container.ts # DI-контейнер
└── index.ts
```

## Dependency Injection

В проекте используется Inversify:

- все зависимости объявляются через интерфейсы

- конкретные реализации подключаются в контейнерах

- упрощает тестирование и замену реализаций

## 🚀 Как запустить и использовать проект

1. Установка зависимостей

Из корневой папки проекта выполните:

```
npm install
```

2. Настройка переменных окружения

Создайте файл .env в корне проекта и скопируйте в него содержимое из .env.local.example (или используйте существующий .env).

3. Запуск MongoDB (через Docker)

Из корневой папки выполните:

```
docker compose up -d
```

Вы должны увидеть логи успешного запуска контейнеров.

Проверка:

MongoDB: localhost:27017

Mongo Express UI: http://localhost:8081

При открытии Mongo Express будет запрошен логин и пароль.
Они указаны в вашем .env файле:

```
ME_CONFIG_BASICAUTH_USERNAME
ME_CONFIG_BASICAUTH_PASSWORD
```

❓❓Как остановить контейнеры

```
docker compose stop
```

4. Запуск backend-сервера (dev-режим)

Из корневой папки выполните:

```
npm run start:dev
```

Если всё запущено корректно, вы увидите логи с:

- Инициализацией контроллеров

- Подключением к MongoDB

- Запуском сервера

В конце будет строка:

```
🚀 Server started on http://localhost:4000
```

Проверка

Откройте:

👉 http://localhost:4000/offers

Вы получите пустой массив [], так как в базе пока нет данных.

5. Запуск mock API сервера

Mock API используется для генерации данных.

Запуск:

```
npm run start:mock-api
```

Откройте:

👉 http://localhost:8000/api

Вы должны увидеть мок-данные.

6. Генерация TSV-файла с мок-данными

```
npm run ts ./src/main.cli.ts -- --generate 10 ./mocks/mock-data.tsv http://localhost:8000

```

7. Импорт TSV-файла в MongoDB

```
npm run ts ./src/main.cli.ts -- --import ./mocks/mock-data.tsv admin test localhost 27017 six-cities a8f7d9e2b4c1f6g3
```

8. Проверка данных
   Через API:

```
   curl http://localhost:4000/offers
```

Через Mongo Express

Перейдите на:

👉 http://localhost:8081

Можно также использовать GUI tool MongoDB Compass

9. Работа с API

Теперь вы можете использовать REST API.

Примеры запросов находятся в разделе ниже

Рекомендуемый порядок:

- Создайте пользователя (/register)

- Войдите в систему (/login)

- Сохраните accessToken

- Используйте этот токен для Bearer Auth

- Выполняйте CRUD-запросы

- Используйте реальные ID из базы данных

## Примеры использования API (cURL) [Сценарии](https://up.htmlacademy.ru/nodejs-api-individual/2/project/scripts) 

- Создание нового предложения

```
curl --location 'http://localhost:4000/offers' \
curl --location 'http://localhost:4000/offers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY2OWZkMWU3ZDJiNzY3YzcyZGI3NDYiLCJpYXQiOjE3NjgzMzMyNzIsImV4cCI6MTc2ODUwNjA3Mn0.OKInqK52sUVxyKW5Qf679Fs8B_gJ2S6YG-7VoSjnIKc' \
--data '{
  "title": "test upload images before final check",
  "description": "test RDO offer test RDO offer test RDO offer",
  "publicationDate": "2025-12-11T00:00:00.000Z",
  "city": {
    "name": "Paris",
    "location": {
      "latitude": 48.85661,
      "longitude": 2.351499
    }
  },
  "previewImage": "https://picsum.photos/id/1025/300/200",
  "propertyPhotos": [
    "https://picsum.photos/id/1/300/200",
    "https://picsum.photos/id/2/300/200",
    "https://picsum.photos/id/3/300/200",
    "https://picsum.photos/id/4/300/200",
    "https://picsum.photos/id/5/300/200",
    "https://picsum.photos/id/6/300/200"
    ],
  "premiumFlag": true,
  "rating": 1,
  "propertyType": "house",
  "roomsNumber": 3,
  "guestsNumber": 4,
  "rentalCost": 120,
  "features": ["Breakfast", "Washer"],
  "coordinates": [52.3702, 4.8952]
}
'
```

- Редактирование предложения

```
curl --location --request PATCH 'http://localhost:4000/offers/6965ffbdd6630e59d473e92c' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA' \
--data '{
"title": "here is new updated title",
"description": "The description is also new, I test update offer feature",
"city": "Paris",
"previewImage": "https://picsum.photos/id/1025/300/200",
"propertyPhotos": [
"https://picsum.photos/id/1/300/200",
"https://picsum.photos/id/2/300/200",
"https://picsum.photos/id/3/300/200",
"https://picsum.photos/id/4/300/200",
"https://picsum.photos/id/5/300/200",
"https://picsum.photos/id/6/300/200"
],
"premiumFlag": true,
"rating": 1,
"propertyType": "house",
"roomsNumber": 3,
"guestsNumber": 4,
"rentalCost": 120,
"features": ["Breakfast", "Washer"],
"coordinates": [52.3702, 4.8952]
}
'
```

- Удаление предложения

```
curl --location --request DELETE 'http://localhost:4000/offers/69660927bffaa1663d602a60' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA'
```

- Получение списка предложений по аренде

```
curl --location 'http://localhost:4000/offers'
```

- Получение детальной информации о предложении

```
curl --location 'http://localhost:4000/offers/6959849afb2409fe2e0da21a'
```

- Получение списка комментариев для предложения

```
curl --location 'http://localhost:4000/offers/69610404dee4835074d6dc8b/comments'
```

- Добавление комментария для предложения

```
curl --location 'http://localhost:4000/offers/69610404dee4835074d6dc8b/comments' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA' \
--data '{
"text": "test RDO!",
"rating": 4,
"publicationDate": "2025-12-12T00:00:00.000Z",
"offerId": "693159fb87987631da7e5a9e"
}'
```

- Создание нового пользователя

```
curl --location 'http://localhost:4000/register' \
--form 'email="joel@gmail.com"' \
--form 'name="Joel"' \
--form 'userType="starter"' \
--form 'avatar=@"postman-cloud:///1f0e04b2-db98-4f70-aec0-ad179b8c3d84"' \
--form 'password="qwerty1"'

```

- Вход в закрытую часть приложения

```
curl --location 'http://localhost:4000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "joel@gmail.com",
  "password": "qwerty1"
}'
```

- Выход из закрытой части приложения

```
curl --location --request POST 'http://localhost:4000/logout' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA' \
--data ''
```

- Проверка состояния пользователя.

```
curl --location 'http://localhost:4000/check-auth' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA'
```

- Получение списка премиальных предложений для города.

```
curl --location 'http://localhost:4000/offers/premium?city=Paris&limit=10'
```

- Получения списка предложений, добавленных в избранное.

```
curl --location 'http://localhost:4000/favorites' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY4Y2JjNGViY2IzN2U1MTMzOTYxNDAiLCJpYXQiOjE3Njg0NzU1OTUsImV4cCI6MTc2ODY0ODM5NX0.YbkX3mS-uzsNqMWOnqi_Pl0s-sOk_MrxpicWJ3Xu9ck'
```

- Добавление/удаление предложения в/из избранное.

```
curl --location --request POST 'http://localhost:4000/offers/696103c4dee4835074d6dc6b/favorites' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA'
```

```
curl --location --request DELETE 'http://localhost:4000/offers/695977728ae3ecead9be144c/favorites' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpvZWxAZ21haWwuY29tIiwiaWQiOiI2OTY1ZmMwY2Q2NjMwZTU5ZDQ3M2U4ZjIiLCJpYXQiOjE3NjgyOTE0ODcsImV4cCI6MTc2ODQ2NDI4N30.-htxduxYOSeVoBhH4thcw0iBXzGccSEvzmoe-PR-mQA'
```
