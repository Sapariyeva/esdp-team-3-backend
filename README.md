# API-документация. 

## POST

**/user/signUp** - регистрация (создание) нового пользователя.
  Тело запроса должно содержать поля в формате JSON:
 - phone
 - role
 - displayName
 - password
   Возвращаемый ответ
   ```
     {
        "success": true,
        "payload": {
            "phone": "7777777771",
            "role": "customer",
            "displayName": "Johathan Littel",
            "identifyingNumber": null,
            "status": "ACTIVE",
            "email": null,
            "avatar": null,
            "avgRating": null,
            "ratingCount": null,
            "lastPostition": null,
            "id": 18,
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Ijc3Nzc3Nzc3NzEiLCJyb2xlIjoicGVyZm9ybWVyIiwiYmlydGhkYXkiOiIyMDA0LTA0LTEwVDA0OjAwOjAwLjAwMFoiLCJkaXNwbGF5TmFtZSI6ItCY0LLQsNC9MmFzZ2FzZmFzYXNmIiwiaWRlbnRpZnlpbmdOdW1iZXIiOm51bGwsInN0YXR1cyI6IkFXQUlUSU5HIiwiZW1haWwiOm51bGwsImF2YXRhciI6bnVsbCwiYXZnUmF0aW5nIjpudWxsLCJyYXRpbmdDb3VudCI6bnVsbCwibGFzdFBvc3RpdGlvbiI6bnVsbCwiaWQiOjE4LCJpYXQiOjE3MDI1Nzc1MDksImV4cCI6MTcwMjY2MzkwOX0.VtPO3zEf_hL4_eiK2dFwrjsXvMRgrATede7mASnFtGQ",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Ijc3Nzc3Nzc3NzEiLCJyb2xlIjoicGVyZm9ybWVyIiwiYmlydGhkYXkiOiIyMDA0LTA0LTEwVDA0OjAwOjAwLjAwMFoiLCJkaXNwbGF5TmFtZSI6ItCY0LLQsNC9MmFzZ2FzZmFzYXNmIiwiaWRlbnRpZnlpbmdOdW1iZXIiOm51bGwsInN0YXR1cyI6IkFXQUlUSU5HIiwiZW1haWwiOm51bGwsImF2YXRhciI6bnVsbCwiYXZnUmF0aW5nIjpudWxsLCJyYXRpbmdDb3VudCI6bnVsbCwibGFzdFBvc3RpdGlvbiI6bnVsbCwiaWQiOjE4LCJpYXQiOjE3MDI1Nzc1MDksImV4cCI6MTcwNTE2OTUwOX0.lNhoA_pPi7zY2NRGinzSGST3ezDo6HHGT6Ty8r50zQA"
        }
    }
   ```
   Если в качестве роли был выбран performer, то в теле запроса будет необходимо также отправить поле birthday и тогда ответ будет следующим
   ```
     {
        "success": true,
        "payload": {
            "phone": "7777777771",
            "role": "performer",
            "birthday": "2004-04-10T04:00:00.000Z",
            "displayName": "Johathan Littel",
            "identifyingNumber": null,
            "status": "AWAITING",
            "email": null,
            "avatar": null,
            "avgRating": null,
            "ratingCount": null,
            "lastPostition": null,
            "id": 18,
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Ijc3Nzc3Nzc3NzEiLCJyb2xlIjoicGVyZm9ybWVyIiwiYmlydGhkYXkiOiIyMDA0LTA0LTEwVDA0OjAwOjAwLjAwMFoiLCJkaXNwbGF5TmFtZSI6ItCY0LLQsNC9MmFzZ2FzZmFzYXNmIiwiaWRlbnRpZnlpbmdOdW1iZXIiOm51bGwsInN0YXR1cyI6IkFXQUlUSU5HIiwiZW1haWwiOm51bGwsImF2YXRhciI6bnVsbCwiYXZnUmF0aW5nIjpudWxsLCJyYXRpbmdDb3VudCI6bnVsbCwibGFzdFBvc3RpdGlvbiI6bnVsbCwiaWQiOjE4LCJpYXQiOjE3MDI1Nzc1MDksImV4cCI6MTcwMjY2MzkwOX0.VtPO3zEf_hL4_eiK2dFwrjsXvMRgrATede7mASnFtGQ",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Ijc3Nzc3Nzc3NzEiLCJyb2xlIjoicGVyZm9ybWVyIiwiYmlydGhkYXkiOiIyMDA0LTA0LTEwVDA0OjAwOjAwLjAwMFoiLCJkaXNwbGF5TmFtZSI6ItCY0LLQsNC9MmFzZ2FzZmFzYXNmIiwiaWRlbnRpZnlpbmdOdW1iZXIiOm51bGwsInN0YXR1cyI6IkFXQUlUSU5HIiwiZW1haWwiOm51bGwsImF2YXRhciI6bnVsbCwiYXZnUmF0aW5nIjpudWxsLCJyYXRpbmdDb3VudCI6bnVsbCwibGFzdFBvc3RpdGlvbiI6bnVsbCwiaWQiOjE4LCJpYXQiOjE3MDI1Nzc1MDksImV4cCI6MTcwNTE2OTUwOX0.lNhoA_pPi7zY2NRGinzSGST3ezDo6HHGT6Ty8r50zQA"
        }
    }
   ```
   Обратите внимание, что статус у пользователя AWAITING, что означает, что менеджеру нужно будет сначала проверить, что указанный возраст соответствует действительности, прежде чем переводить его в статус ACTIVE.

**/user/signIn** - логин пользователя/
  Тело запроса должно содержать поля в формате JSON:
 - phone
 - password
   Возвращаемый ответ
   ```
     {
        "success": true,
        "message": "You logged in",
        "payload": {
            "id": 3,
            "displayName": "Johathan Littel",
            "phone": "7973458315",
            "email": null,
            "avatar": null,
            "birthday": null,
            "role": "manager",
            "avgRating": null,
            "ratingCount": null,
            "lastPostition": null,
            "identifyingNumber": null,
            "status": "ACTIVE",
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZGlzcGxheU5hbWUiOiJKb2hhdGhhbiBMaXR0ZWwiLCJwaG9uZSI6Ijc5NzM0NTgzMTUiLCJlbWFpbCI6bnVsbCwiYXZhdGFyIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwicm9sZSI6Im1hbmFnZXIiLCJhdmdSYXRpbmciOm51bGwsInJhdGluZ0NvdW50IjpudWxsLCJsYXN0UG9zdGl0aW9uIjpudWxsLCJpZGVudGlmeWluZ051bWJlciI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzAyNTc3NDAwLCJleHAiOjE3MDI2NjM4MDB9.dExJ6FNSGj-5cTBYcevohjlQo3vNFlXIGqRCwecDIec",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZGlzcGxheU5hbWUiOiJKb2hhdGhhbiBMaXR0ZWwiLCJwaG9uZSI6Ijc5NzM0NTgzMTUiLCJlbWFpbCI6bnVsbCwiYXZhdGFyIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwicm9sZSI6Im1hbmFnZXIiLCJhdmdSYXRpbmciOm51bGwsInJhdGluZ0NvdW50IjpudWxsLCJsYXN0UG9zdGl0aW9uIjpudWxsLCJpZGVudGlmeWluZ051bWJlciI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzAyNTc3NDAwLCJleHAiOjE3MDUxNjk0MDB9.3nR5jAB_oKqv8v6IxpO4Nnb_RNZ2CErQdco6l6H4DtY"
        }
    }
   ```
   Если в БД будет найдено несколько записей с одним и тем же телефоном, но разными ролями, то ответ придет со списком пользователей, одного из которых ужно будет выбрать, используя запрос **/user/signInWithRole**
   ```
     {
        "success": true,
        "message": "Choose your role",
        "payload": {
            "0": {
                "id": 6,
                "displayName": "Alfredo Reichert",
                "phone": "7107296254",
                "email": null,
                "avatar": null,
                "birthday": null,
                "role": "customer",
                "avgRating": null,
                "ratingCount": null,
                "lastPostition": null,
                "identifyingNumber": null,
                "status": "ACTIVE"
            },
            "1": {
                "id": 2,
                "displayName": "Alfredo Reichert",
                "phone": "7107296254",
                "email": "user@example.com",
                "avatar": null,
                "birthday": null,
                "role": "manager",
                "avgRating": null,
                "ratingCount": null,
                "lastPostition": null,
                "identifyingNumber": null,
                "status": "ACTIVE"
            },
            "2": {
                "id": 11,
                "displayName": "Alfredo Reichert",
                "phone": "7107296254",
                "email": null,
                "avatar": null,
                "birthday": null,
                "role": "performer",
                "avgRating": null,
                "ratingCount": null,
                "lastPostition": null,
                "identifyingNumber": null,
                "status": "ACTIVE"
            }
        }
     }
   ```

**/user/signInWithRole** - выбор роли под которым будет происходить логин пользователя, если он имеет несколько ролей, которые ему вернул сервер в ответ на **/user/signIn**
  Тело запроса должно содержать поля в формате JSON:
  - phone
  - password
  - role
    Как и в случае c **/user/signIn**, при котором у пользователя в БД находится только одна роль придет ответ:
    ```
      {
          "success": true,
          "message": "You logged in",
          "payload": {
              "id": 2,
              "displayName": "Alfredo Reichert",
              "phone": "7107296254",
              "email": "user@example.com",
              "avatar": null,
              "birthday": null,
              "role": "manager",
              "avgRating": null,
              "ratingCount": null,
              "lastPostition": null,
              "identifyingNumber": null,
              "status": "ACTIVE",
              "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZGlzcGxheU5hbWUiOiJBbGZyZWRvIFJlaWNoZXJ0IiwicGhvbmUiOiI3MTA3Mjk2MjU0IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiYXZhdGFyIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwicm9sZSI6Im1hbmFnZXIiLCJhdmdSYXRpbmciOm51bGwsInJhdGluZ0NvdW50IjpudWxsLCJsYXN0UG9zdGl0aW9uIjpudWxsLCJpZGVudGlmeWluZ051bWJlciI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzAyNTc5NTAxLCJleHAiOjE3MDI2NjU5MDF9.pj-aK-xIEjmJg044HVd-_hdlvlIF9IHzVJFOB2nKgYo",
              "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZGlzcGxheU5hbWUiOiJBbGZyZWRvIFJlaWNoZXJ0IiwicGhvbmUiOiI3MTA3Mjk2MjU0IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiYXZhdGFyIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwicm9sZSI6Im1hbmFnZXIiLCJhdmdSYXRpbmciOm51bGwsInJhdGluZ0NvdW50IjpudWxsLCJsYXN0UG9zdGl0aW9uIjpudWxsLCJpZGVudGlmeWluZ051bWJlciI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzAyNTc5NTAxLCJleHAiOjE3MDUxNzE1MDF9.Qi1s2PzZ52amosmgdqB_VH3sBidSKvqqmPyFTUb-BAs"
          }
      }
    ```

**/user/signOut**  - разлогин пользователя
  Возвращаемый ответ
  ```
  {
      success: true,
      message: 'You logged out'
  }
  ```


## GET

**/user** возвращает список пользователей. Доступно только для авторизованного пользователя с ролью admin или manager.
 Доступные на данный момент query-параметры:
 - phone, фильтрует список по телефону, например "/user?phone=7103895429",
 - email, фильтрует список по Email, например "/user?email=user@example.com",
 - role, фильтрует список по роли пользователя, например "/user?role=manager" или "/user?role=customer"
 - status, фильтрует список по статусу пользователя, например "/user?status=ACTIVE" или "/user?status=BLOCKED"
 - offset, указывает количество пропущенных записей, например "/user?offset=10" пропустит первые 10 записей и вернет список, начиная с 11 позиции
 - limit, указывает максимальной количество записей, которое будет отображаться на одной странице.
   Комбинация offset и limit отвечает за функционал пагинации, например "/user?offset=30&limit=15" является ссылкой на третью страницу, т.к. первые две страницы по 15 записей были пропущены.
   По умолчанию, если эти параметры пагинации не были отправлены, то offset принимает значение 0, а limit значение 20.
   Параметры можно комбинировать между собой и даже перечислить все сразу в одном запросе "/user?phone=7103895429&email=user@example.com&role=manager&status=ACTIVE&offset=18&limit=6"

   Пример формата в котором придет информация, для которого использовался запрос "user?role=manager&status=ACTIVE&offset=2&limit=2":
  ```
    {
        "users": [
            {
                "id": 4,
                "displayName": "Sylvia Wintheiser",
                "phone": "7370776225",
                "email": null,
                "password": "$2b$10$HaUbtGKwzsIlJUsDlYd6aewY8AO7/.zaAkBXi/RXCbuBWFQWOiCKa",
                "avatar": null,
                "birthday": null,
                "role": "manager",
                "avgRating": null,
                "ratingCount": null,
                "lastPostition": null,
                "identifyingNumber": null,
                "status": "ACTIVE"
            },
            {
                "id": 5,
                "displayName": "Hal Blanda",
                "phone": "7254444729",
                "email": null,
                "password": "$2b$10$Nu1O6b8RPki2nVkaQML2Le0dhnTO.HTFetIPbs4KONlz66lg6Faf6",
                "avatar": null,
                "birthday": null,
                "role": "manager",
                "avgRating": null,
                "ratingCount": null,
                "lastPostition": null,
                "identifyingNumber": null,
                "status": "ACTIVE"
            }
        ],
        "totalItems": 4,
        "totalPages": 2,
        "links": {
            "next": null,
            "prev": "/user?role=manager&status=ACTIVEoffset=0&limit=2",
            "first": "/user?role=manager&status=ACTIVEoffset=0&limit=2",
            "last": "/user?role=manager&status=ACTIVEoffset=2&limit=2",
            "page1": "/user?role=manager&status=ACTIVEoffset=0&limit=2",
            "page2": "/user?role=manager&status=ACTIVEoffset=2&limit=2"
        }
    }
  ```


**/user/:id** возвращает информацию о конкретном пользователе, по сути отрабатывает как сочетание параметров phone и role, которые тоже возвращают один результат, но с

  Формат вывода:
  ```
    {
      "id": 2,
      "displayName": "Alfredo Reichert",
      "phone": "7107296254",
      "email": "user@example.com",
      "avatar": null,
      "birthday": null,
      "role": "manager",
      "avgRating": null,
      "ratingCount": null,
      "lastPostition": null,
      "identifyingNumber": null,
      "status": "ACTIVE"
    }
  ```

**/user/refresh** обновляет access и refresh токены, и тем самым продлевает сессию. Отработает корректно, если refresh токен не истек.
  Возвращаемый ответ
  ```
    {
        "success": true,
        "message": "Tokens refreshed",
        "payload": {
            "id": 2,
            "displayName": "Alfredo Reichert",
            "phone": "7107296254",
            "email": "user@example.com",
            "avatar": null,
            "birthday": null,
            "role": "manager",
            "avgRating": null,
            "ratingCount": null,
            "lastPostition": null,
            "identifyingNumber": null,
            "status": "ACTIVE",
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZGlzcGxheU5hbWUiOiJBbGZyZWRvIFJlaWNoZXJ0IiwicGhvbmUiOiI3MTA3Mjk2MjU0IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiYXZhdGFyIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwicm9sZSI6Im1hbmFnZXIiLCJhdmdSYXRpbmciOm51bGwsInJhdGluZ0NvdW50IjpudWxsLCJsYXN0UG9zdGl0aW9uIjpudWxsLCJpZGVudGlmeWluZ051bWJlciI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzAyNTc5OTExLCJleHAiOjE3MDI2NjYzMTF9.4vWURemIPMstusQ0lsbyyWIaoZboshVDC7w1-SKmEpY",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZGlzcGxheU5hbWUiOiJBbGZyZWRvIFJlaWNoZXJ0IiwicGhvbmUiOiI3MTA3Mjk2MjU0IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiYXZhdGFyIjpudWxsLCJiaXJ0aGRheSI6bnVsbCwicm9sZSI6Im1hbmFnZXIiLCJhdmdSYXRpbmciOm51bGwsInJhdGluZ0NvdW50IjpudWxsLCJsYXN0UG9zdGl0aW9uIjpudWxsLCJpZGVudGlmeWluZ051bWJlciI6bnVsbCwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzAyNTc5OTExLCJleHAiOjE3MDUxNzE5MTF9.unxkpZ9yPRSomrNMvFjNz3L_qoj5hxfR1H03PsR9Pxo"
        }
    }
  ```

**/order** возвращает все заказы. Доступно для любого авторизованного пользователя.
Доступные на данный момент query-параметры:
 - service, фильтрует список по ID сервиса(категории), например "/order?service=1". Тут у на всего два возможных варианта - это либо 1(Грузчик), либо 2(Грузовой транспорт),
 - manager, фильтрует список по ID менеджера, например "/order?manager=2",
 - customer, фильтрует список по ID заказчика, например "/order?customer=6",
 - status, фильтрует список по статусу заказа, например "/order?status=SEARCHING" или "/user?status=CANCELED"
 - offset, указывает количество пропущенных записей, например "/order?offset=10" пропустит первые 10 записей и вернет список, начиная с 11 позиции
 - limit, указывает максимальной количество записей, которое будет отображаться на одной странице.
   Комбинация offset и limit отвечает за функционал пагинации, например "/order?offset=30&limit=15" является ссылкой на третью страницу, т.к. первые две страницы по 15 записей были пропущены.
   По умолчанию, если эти параметры пагинации не были отправлены, то offset принимает значение 0, а limit значение 20.
   Параметры можно комбинировать между собой и даже перечислить все сразу в одном запросе "/order?service=1&manager=2&customer=6&status=IN_PROGRESS&offset=18&limit=6"

   Как можно заметить offset и limit являются универсальными параметрами и одинаково отрабатывают как на списках пользователей, так и на списках заказов.

  Пример формата в котором придет информация, для которого использовался запрос "order?service=2&manager=3&offset=2&limit=2":
  ```
    {
      "orders": [
            {
                "id": 29,
                "customerId": 6,
                "serviceId": 2,
                "createdAt": "2023-12-13T15:14:00.000Z",
                "orderData": "2024-01-06T15:14:01.000Z",
                "address": "4447 Haley Fields",
                "description": null,
                "performersQuantity": 19,
                "timeWorked": null,
                "income": null,
                "performerPayment": null,
                "tax": null,
                "profit": null,
                "lat": -32,
                "lng": 65,
                "managerId": 3,
                "managerCommentary": null,
                "status": "IN_PROGRESS",
                "customer": {
                    "id": 6,
                    "displayName": "Alfredo Reichert",
                    "phone": "7107296254",
                    "email": null,
                    "password": "$2b$10$SwdHI0bLucEGEFRRMqzW0egFTfwL9CcG8/yzYgrgUc4lgKaEkrPZ.",
                    "avatar": null,
                    "birthday": null,
                    "role": "customer",
                    "avgRating": null,
                    "ratingCount": null,
                    "lastPostition": null,
                    "identifyingNumber": null,
                    "status": "ACTIVE"
                },
                "performers": []
            },
            {
                "id": 31,
                "customerId": 10,
                "serviceId": 2,
                "createdAt": "2023-12-13T15:14:00.000Z",
                "orderData": "2023-12-28T15:14:01.000Z",
                "address": "86710 Brady Spur",
                "description": null,
                "performersQuantity": 8,
                "timeWorked": null,
                "income": null,
                "performerPayment": null,
                "tax": null,
                "profit": null,
                "lat": 41,
                "lng": 29,
                "managerId": 3,
                "managerCommentary": null,
                "status": "IN_PROGRESS",
                "customer": {
                    "id": 10,
                    "displayName": "Chyna Kiehn",
                    "phone": "7447422648",
                    "email": null,
                    "password": "$2b$10$.JHHll9TFX3pyt.dCL3v9.UUJaxLSAy3zghLkeBaPn2syzhjZGasG",
                    "avatar": null,
                    "birthday": null,
                    "role": "customer",
                    "avgRating": null,
                    "ratingCount": null,
                    "lastPostition": null,
                    "identifyingNumber": null,
                    "status": "ACTIVE"
                },
                "performers": []
            }
        ],
        "totalItems": 7,
        "totalPages": 4,
        "links": {
            "next": "/order?service=2&manager=3&sortOrder=ASCoffset=4&limit=2",
            "prev": "/order?service=2&manager=3&sortOrder=ASCoffset=0&limit=2",
            "first": "/order?service=2&manager=3&sortOrder=ASCoffset=0&limit=2",
            "last": "/order?service=2&manager=3&sortOrder=ASCoffset=6&limit=2",
            "page1": "/order?service=2&manager=3&sortOrder=ASCoffset=0&limit=2",
            "page2": "/order?service=2&manager=3&sortOrder=ASCoffset=2&limit=2",
            "page3": "/order?service=2&manager=3&sortOrder=ASCoffset=4&limit=2",
            "page4": "/order?service=2&manager=3&sortOrder=ASCoffset=6&limit=2"
        }
    }
  ```

**/order/:id**  возвращает информацию о конкретном заказе.
  Формат вывода:
    ```
      {
        "id": 5,
        "customerId": 6,
        "serviceId": 1,
        "createdAt": "2023-12-13T15:14:00.000Z",
        "orderData": "2024-01-11T15:14:01.000Z",
        "address": "11938 Hermann Ranch",
        "description": null,
        "performersQuantity": 8,
        "timeWorked": null,
        "income": null,
        "performerPayment": null,
        "tax": null,
        "profit": null,
        "lat": -34,
        "lng": -35,
        "managerId": 3,
        "managerCommentary": null,
        "status": "IN_PROGRESS"
      }
    ```


## Запуск фикстур

Прописать в корневой директории проекта
```
npm run seed
```
