---
layout: post
title: "Golang에서 ORM 사용하기"
author: Sun
date: 2020-04-11 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go-ORM 또는 GORM을 사용하여 sqlite3 데이터베이스와 간단한 방식으로 
상호 작용하는 방법을 살펴 보겠습니다."
---

이 포스트에서는 Go-ORM 또는 GORM을 사용하여 sqlite3 데이터베이스와 간단한 방식으로 
상호 작용하는 방법을 살펴 보겠습니다.

ORM 또는 Object Relationship Manager는 개발자와 기본 데이터베이스 기술 간의 
중개자 역할을합니다. 
그것들은 우리가 평소와 같이 본질적으로 객체를 다루고 복잡한 SQL 문을 만들지 않고도 
이러한 객체를 저장할 수 있도록합니다.

SQL로 작업하고 싶지 않지만 데이터베이스가 필요한 시나리오에서 코드베이스의 복잡성을 효과적으로 
줄입니다.

## Video Tutorial

[![video tutorial](https://img.youtube.com/vi/VAGodyl84OY/0.jpg)](https://youtu.be/VAGodyl84OY)

## Installation

`jinzhu/gorm`을 설치하려면 다음 `go get` 명령을 수행해야합니다.

```bash
go get -u github.com/jinzhu/gorm
```

이 작업을 마친 후에는 `jinzhu/gorm`을 모든 Go 기반 프로젝트로 가져올 수 있습니다.

## A Simple Example

예를 들어 특정 API 엔드 포인트에 도달했을 때 데이터베이스에 
새 사용자 및 이메일을 저장하는 go REST API를 작성하려고한다고 가정하십시오.

우리는 다음과 같이 사용자를 go `struct`로 기술할 수 있습니다.

```go 
// Our User Struct
type User struct {
    gorm.Model
    Name  string
    Email string
}
```

사용자 모델을 정의한 후에는 새로운 사용자를 sqlite3 데이터베이스에 저장할 수 있는 
API 엔드 포인트를 노출할 수 있습니다.

>**참고** - 고유한 Go 기반 REST API를 개발할 수 있는 방법을 알고 싶다면 
>다른 Go 포스트: [Go에서 RESTful API 빌드하기](../Ch03-Creating-RESTful-API)를 확인하십시오.

## Our API

그래서 우리는 4개의 서로 다른 `CRUD` 엔드 포인트를 특징으로하는 매우 간단한 API를 만들 것입니다. 
모든 사용자를 반환하고 새 사용자를 추가하며 사용자를 삭제하고 사용자를 업데이트합니다.

새로운 `GORM`의 도움으로 표준 원시 `SQL` 라우트를 중단한 경우 이러한 엔드 포인트 생성이 
이전보다 훨씬 간단 해졌습니다.

```go 
package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/gorilla/mux"
)

func allUsers(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "All Users Endpoint Hit")
}

func newUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "New User Endpoint Hit")
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Delete User Endpoint Hit")
}

func updateUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Update User Endpoint Hit")
}

func handleRequests() {
    myRouter := mux.NewRouter().StrictSlash(true)
    myRouter.HandleFunc("/users", allUsers).Methods("GET")
    myRouter.HandleFunc("/user/{name}", deleteUser).Methods("DELETE")
    myRouter.HandleFunc("/user/{name}/{email}", updateUser).Methods("PUT")
    myRouter.HandleFunc("/user/{name}/{email}", newUser).Methods("POST")
    log.Fatal(http.ListenAndServe(":8081", myRouter))
}


func main() {
    fmt.Println("Go ORM Tutorial")

    // Handle Subsequent requests
    handleRequests()
}
```

그런 다음 `go run main.go`를 실행하여 이 새로운 API를 시작할 수 있습니다. 
이 API는 `ORM` 기반 솔루션을 구축할 기반을 나타냅니다.

## SQLite3 Database Creation and Automatic Schema Migration

프로젝트의 다음 단계는 데이터베이스를 만드는 것입니다. 이 포스트의 목적상, 
사용 및 설정이 쉬운 `sqlite3` 데이터베이스를 사용하려고합니다.

>**참고** – 방언을 전환하여 GORM을 사용하여 다른 데이터베이스 기술을 상당히 쉽게 
>사용할 수 있습니다.

`GORM`을 사용하여 `db.AutoMigrate(&User{})`를 호출하여 데이터베이스 내에 
User 테이블을 자동으로 작성할 수 있습니다. 
이것은 테이블 생성 SQL 스크립트를 작성하는 번거로움을 덜어줍니다.

```go 
// our initial migration function
func initialMigration() {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        fmt.Println(err.Error())
        panic("failed to connect database")
    }
    defer db.Close()

    // Migrate the schema
    db.AutoMigrate(&User{})
}

func main() {
    fmt.Println("Go ORM Tutorial")

    // Add the call to our new initialMigration function
    initialMigration()

    handleRequests()
}
```

## Updating our All Users Endpoint

`allUsers()` 함수 내에서 기본적으로 데이터베이스 내의 모든 `User` 레코드를 쿼리한 다음
이를 JSON으로 인코딩하여 응답으로 리턴하려고합니다.

`db.Find(& users)`를 호출하여 데이터베이스 내의 모든 users를 쿼리할 수 있습니다.

```go 
func allUsers(w http.ResponseWriter, r *http.Request) {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    var users []User
    db.Find(&users)
    fmt.Println("{}", users)

    json.NewEncoder(w).Encode(users)
}
```

## Updating our New User Endpoint

이제 새로운 사용자를 데이터베이스에 삽입 할 수 있도록 `newUser()` 함수를 업데이트하려고 
합니다. 
API에 대한 요청의 검색어 매개 변수에서 사용자 이름과 이메일을 모두 parsing 해야합니다.

엔드 포인트의 경로 매개 변수를 parsing한 다음 이러한 경로 매개 변수를 사용하여 
새 `User` 오브젝트를 채우고 다음과 같이 `db.Create(&User{Name: name, Email: email})`을 호출하여 
`sqlite` 데이터베이스에 삽입합니다. 그러면 다음과 같이 나타낼 수 있습니다:

```go 
func newUser(w http.ResponseWriter, r *http.Request) {
    fmt.Println("New User Endpoint Hit")

    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    vars := mux.Vars(r)
    name := vars["name"]
    email := vars["email"]

    db.Create(&User{Name: name, Email: email})
    fmt.Fprintf(w, "New User Successfully Created")
}
```

## Our Delete User Endpoint

`deleteUser()` 함수는 경로 매개 변수를 통해 전달된 동일한 `name`과 일치하는 사용자를 
삭제합니다. 
다소 기본적이며 데이터베이스에 동일한 사용자를 가진 사용자가 두 명 이상있는 경우를 
처리하지 않지만 이 프로젝트에서 좋은 예를 제공합니다.

```go 
func deleteUser(w http.ResponseWriter, r *http.Request) {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    vars := mux.Vars(r)
    name := vars["name"]

    var user User
    db.Where("name = ?", name).Find(&user)
    db.Delete(&user)

    fmt.Fprintf(w, "Successfully Deleted User")
}
```

## Our Update User Endpoint

데이터베이스 내에서 기존 사용자를 업데이트해야 할 경우 GORM을 사용하여 훨씬 쉽게 
수행할 수 있습니다. 
기본적으로 고유 이름을 사용하여 지정된 사용자를 검색해야합니다.

이 사용자가 있으면 일반적으로 표준 go 객체와 마찬가지로 User 객체 만 업데이트하면됩니다. 
오브젝트와 갱신 사항에 만족하면 `db.Save(&user)`를 호출하여 변경 사항을 데이터베이스에 
저장하십시오.

```go 
func updateUser(w http.ResponseWriter, r *http.Request) {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    vars := mux.Vars(r)
    name := vars["name"]
    email := vars["email"]

    var user User
    db.Where("name = ?", name).Find(&user)

    user.Email = email

    db.Save(&user)
    fmt.Fprintf(w, "Successfully Updated User")
}
```

## Full Source Code

이 프로젝트의 전체 소스 코드를 원하면 이 gist를 확인하십시오: 
[https://gist.github.com/elliotforbes/e241eaa8cc9d7bf3ec75b333e891d422](https://gist.github.com/elliotforbes/e241eaa8cc9d7bf3ec75b333e891d422)