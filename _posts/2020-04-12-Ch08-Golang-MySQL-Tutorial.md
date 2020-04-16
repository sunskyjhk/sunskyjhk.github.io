---
layout: post
title: "Golang에서 MySQL 사용하기"
author: Sun
date: 2020-04-12 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 MySQL 데이터베이스에 연결하고 Go를 사용하여 기본 SQL 문을 수행하는 
방법을 보여 드리겠습니다."
---

Golang 학습 과정을 계속함에 따라 어떤 형태의 데이터베이스와 상호 작용해야하는 것은 거의 불가피합니다.

이 포스트에서는 MySQL 데이터베이스에 연결하고 Go를 사용하여 기본 SQL 문을 수행하는 
방법을 보여 드리겠습니다.

## Why MySQL?

MySQL은 현재 개발자가 사용할 수있는 가장 잘 알려진 잘 사용되는 데이터베이스 기술 중 하나입니다. 
주변에는 절대적으로 거대한 커뮤니티가 있으며 Wordpress의 기본 데이터베이스 기술로 웹의 절반을 강화할 수 있습니다.

MySQL 인스턴스를 로컬로 돌리는 것은 매우 쉬우므로 적절한 애플리케이션을 구축하기에 완벽합니다.

>**참고** - 기술 선택은 인기를 기반으로하지 않아야하며 CockroachDB 또는 NoSQL 데이터베이스와 같은 대안을 고려해야하는 
>시나리오가 있을 수 있습니다.

## Video Tutorial

[![video tutorial](https://img.youtube.com/vi/DWNozbk_fuk/0.jpg)](https://youtu.be/DWNozbk_fuk)

## Text Tutorial

이를 위해 [https://github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) 을 
MySQL 드라이버로 사용합니다. 
`Go-SQL-Driver`는 가볍고 빠른 MySQL 드라이버로 `TCP/IPv4`, `TCP/IPv6`, `Unix domain sockets` 또는 
사용자 지정 프로토콜을 통한 연결을 지원하며 끊어진 연결을 자동으로 처리합니다.

> Github Repo: [go-sql-driver/mysql](https://github.com/go-sql-driver/mysql)

## Connection Pooling

고성능 데이터베이스 응용 프로그램을 구축하는 경우 연결 풀링이 반드시 필요합니다.

고맙게도 이 포스트의 기초로 사용할 오픈 소스 패키지는 `database/SQL` 표준 패키지를 사용하므로 자동 연결 풀링 기능이 있습니다.

이는 기본적으로 데이터베이스를 쿼리할 때마다 응용 프로그램 시작시 설정된 연결 풀에서 연결을 사용하고 있음을 의미합니다. 
이러한 연결은 계속해서 재사용되며, 따라서 쿼리를 수행할 때마다 새 연결을 작성하여 삭제하지 않음을 의미합니다.

## Implementation

먼저 로컬 머신에 설정한 데이터베이스에 연결한 다음 기본적인 삽입 및 선택 명령문을 수행합니다.

## Connecting to a MySQL database

새로운 main.go 파일을 만들어 봅시다. 
이 과정에서 몇 개의 패키지를 가져와서 이미 실행중인 로컬 데이터베이스에 대한 간단한 연결을 설정합니다. 
이 포스트에서는 phpmyadmin을 사용하여 MySQL을 시작했으며 `test`라는 데이터베이스를 만들어 테이블에 연결하고 테이블을 만듭니다.

`sql.Open`을 사용하여 데이터베이스에 연결하고 자동 연결 풀을 설정하면 `db` 또는 `err`을 처리할 수 있습니다.

```go 
package main

import (
    "fmt"
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    fmt.Println("Go MySQL Tutorial")

    // Open up our database connection.
    // I've set up a database on my local machine using phpmyadmin.
    // The database is called testDb
    db, err := sql.Open("mysql", "username:password@tcp(127.0.0.1:3306)/test")

    // if there is an error opening the connection, handle it
    if err != nil {
        panic(err.Error())
    }

    // defer the close till after the main function has finished
    // executing
    defer db.Close()

}
```

## Performing Basic SQL Commands

이제 연결을 만들었으므로 데이터베이스에 쿼리를 제출해야합니다.

고맙게도 `db.Query(sql)`를 사용하면 원하는 SQL 명령을 수행할 수 있습니다. 
쿼리 문자열을 구성하여 매개 변수로 전달하면됩니다.

```go 
package main

import (
    "fmt"
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    fmt.Println("Go MySQL Tutorial")

    // Open up our database connection.
    // I've set up a database on my local machine using phpmyadmin.
    // The database is called testDb
    db, err := sql.Open("mysql", "root:password1@tcp(127.0.0.1:3306)/test")

    // if there is an error opening the connection, handle it
    if err != nil {
        panic(err.Error())
    }

    // defer the close till after the main function has finished
    // executing
    defer db.Close()

    // perform a db.Query insert
    insert, err := db.Query("INSERT INTO test VALUES ( 2, 'TEST' )")

    // if there is an error inserting, handle it
    if err != nil {
        panic(err.Error())
    }
    // be careful deferring Queries if you are using transactions
    defer insert.Close()


}
```

## Populating Structs from Results

데이터베이스에서 결과 세트를 검색하는 것은 모두 훌륭하지만 좋은 결과를 읽거나 기존 구조체를 채워서 파싱하고 쉽게 수정할 수 있어야합니다. 
여러 행을 구문 분석하기 위해 .Scan (args ...) 메소드를 사용하여 여러 인수를 가져와 복합 객체를 채울 수 있습니다.

```go 
/*
 * Tag... - a very simple struct
 */
type Tag struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}
```

```go 
func main() {
    // Open up our database connection.
    db, err := sql.Open("mysql", "root:pass1@tcp(127.0.0.1:3306)/tuts")

    // if there is an error opening the connection, handle it
    if err != nil {
        log.Print(err.Error())
    }
    defer db.Close()

    // Execute the query
    results, err := db.Query("SELECT id, name FROM tags")
    if err != nil {
        panic(err.Error()) // proper error handling instead of panic in your app
    }

    for results.Next() {
        var tag Tag
        // for each row, scan the result into our tag composite object
        err = results.Scan(&tag.ID, &tag.Name)
        if err != nil {
            panic(err.Error()) // proper error handling instead of panic in your app
        }
                // and then print out the tag's Name attribute
        log.Printf(tag.Name)
    }

}
```

이 예에서는 태그 데이터베이스에서 2 개의 열을 검색한 다음 `.Scan`을 사용하여 태그 객체를 채웁니다.

>**참고** - 데이터베이스에서 3개의 필드를 검색하고 스캔에 2개의 매개 변수만있는 경우 실패합니다. 
>그들은 정확히 일치해야합니다.

## Querying a Single Row

이번에 하나의 행을 쿼리하고 ID를 가지고 구조체를 채우고 싶다고 가정 해보십시오. 
우리는 그렇게 할 수 있습니다:

```go 
var tag Tag
// Execute the query
err = db.QueryRow("SELECT id, name FROM tags where id = ?", 2).Scan(&tag.ID, &tag.Name)
if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
}

log.Println(tag.ID)
log.Println(tag.Name)
```

## Conclusion

이 포스트에서는 MySQL에 대한 연결을 설정한 다음 해당 데이터베이스에 대한 간단한 쿼리를 수행하고 반환된 응답을 구조체 또는 구조체 배열에 마샬링했습니다. 
이를통해 더 나아가 MySQL을 기반으로 고유한 Go 애플리케이션을 구축하는데 필요한 모든 것을 제공할 수 있기를 바랍니다.

## Recommanded Reading:

* [Creating a RESTful JSON api with Go](https://tutorialedge.net/golang/creating-restful-api-with-golang/)