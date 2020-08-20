# Get the list of trips

Retrieves a paginated and filtered list of trips.

**URL** : `/api/trips/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any authenticated user allowed. Only admin users can filter trips belonging to other users.

**Query string parameters**


| Parameter     | Purpose                                                       |
| ------------- | ------------------------------------------------------------- |
|destination    | Filter destinationcontaining case insensitive                 |
|comment        | Filter comment containing case insensitive                    |
|start_date_gte | Filter start date greater or equal than                       |
|start_date_lt  | Filter start date less than                                   |
|end_date_gte   | Filter end date greater or equal than                         |
|end_date_lt    | Filter start date less than                                   |
|user           | Filter by user id                                             |
|limit          | Page size                                                     |
|offset         | Initial offset for pagination                                 |

## Success Responses

**Code** : `200 OK`

**Content example** : 

Trips are sorted by start_date, user id and id. By default page size is 10 elements.

```json
{
    "count": 15,
    "next": "http://localhost:8000/api/trips/?limit=10&offset=10",
    "previous": null,
    "results": [
        {
            "id": 189,
            "destination": "ALICANTE",
            "start_date": "2020-07-01",
            "end_date": "2020-07-02",
            "comment": "One newspaper media very fire. Seem phone population price example include. American skill tax everything accept analysis.",
            "count_to_trip_start": 26,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 190,
            "destination": "MADRID",
            "start_date": "2020-07-03",
            "end_date": "2020-07-04",
            "comment": "Worry daughter store eye keep. Different soldier thing easy just lot. Beat again successful letter.",
            "count_to_trip_start": 28,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 191,
            "destination": "MADRID",
            "start_date": "2020-07-05",
            "end_date": "2020-07-06",
            "comment": "Better southern talk travel them rich.\nNeed art red. News Mrs recognize. Than glass pass I leader.\nExplain opportunity head behavior TV happen measure. Interview sing truth.",
            "count_to_trip_start": 30,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 192,
            "destination": "CHICAGO",
            "start_date": "2020-07-07",
            "end_date": "2020-07-08",
            "comment": "Design power respond cup few away.\nUnder tax best sit require if. Business dog sign her city office value. Month stop into.",
            "count_to_trip_start": 32,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 193,
            "destination": "BARCELONA",
            "start_date": "2020-07-09",
            "end_date": "2020-07-10",
            "comment": "Institution issue part process thank once add. State us fall product.\nProfessional space put buy size dark. Other course forget safe public determine show. Race public culture poor.",
            "count_to_trip_start": 34,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 194,
            "destination": "BRUSSELS",
            "start_date": "2020-07-11",
            "end_date": "2020-07-12",
            "comment": "Unit lot threat perform specific.\nGround return thought laugh daughter claim discover. Act cell above hope race city police.",
            "count_to_trip_start": 36,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 195,
            "destination": "GHENT",
            "start_date": "2020-07-13",
            "end_date": "2020-07-14",
            "comment": "Down spring pass exist popular our cover. Financial become letter nor read account me.\nAlready each place clear sure computer these candidate. Put respond on four me sing material.",
            "count_to_trip_start": 38,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 196,
            "destination": "LONDON",
            "start_date": "2020-07-15",
            "end_date": "2020-07-16",
            "comment": "Whole move prevent actually chair worker tree. Stage specific media performance next well degree. Break cover rule truth.",
            "count_to_trip_start": 40,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 197,
            "destination": "MADRID",
            "start_date": "2020-07-17",
            "end_date": "2020-07-18",
            "comment": "Medical involve just Democrat fish. Create product same necessary answer against.\nParent but reflect series. Game will special. Imagine exactly decade man indeed treatment game.",
            "count_to_trip_start": 42,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        },
        {
            "id": 198,
            "destination": "CHICAGO",
            "start_date": "2020-07-19",
            "end_date": "2020-07-20",
            "comment": "Hope body traditional staff little weight attention. Including maintain main between break.\nAbout mission really free common process. Not talk maybe item. Top easy lose magazine shake wrong.",
            "count_to_trip_start": 44,
            "user": 166,
            "user_full_name": "Regular Many Trips User"
        }
    ]
}
```

## Error Responses

**Code** : `400 BAD REQUEST` If a non admin user tries to retrieve trips belonging to another user.

**Code** : `401 UNAUTHORIZED` For non authenticated requests.
