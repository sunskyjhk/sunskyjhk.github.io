---
layout: post
title: "Go에서 환경 변수로 작업하기"
author: Sun
date: 2020-04-15 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go 애플리케이션에서 환경 변수를 효과적으로 가져오고 설정하는 방법과 
이후에 환경 변수를 애플리케이션 내의 기능 플래그의 기초로 사용하는 방법을 알아보겠습니다."
---

보다 복잡한 Go 기반 응용 프로그램을 구축하기 시작하면서 새로운 기능을 안전하게 도입하거나 
데이터베이스 또는 브로커와 같은 자격 증명을 처리할 때 문제가 발생하기 시작합니다.

환경 변수를 사용하면 다양한 환경에서 자격 증명을 처리하고 시스템의 기능 플래그 구현을 단순화하는 등 
다양한 측면을 단순화 할 수 있습니다.

이 튜토리얼에서는 다음을 다룰 것입니다.
* Go 애플리케이션에서 환경 변수를 효과적으로 가져오고 설정하는 방법
* 이후에 환경 변수를 애플리케이션 내의 기능 플래그의 기초로 사용하는 방법

## Handling Credentials

Go에서 분산 시스템을 작성하는 경우 구성에 관한 최상의 방법은 환경에 저장하는 것입니다.

이 방법을 사용하면 개발 데이터베이스 자격 증명이 이미 환경에 주입된 개발 서버인 응용 프로그램 버전을 
실제로 쉽게 배포할 수 있습니다.

개발 노력에 만족하면 추가 번거로움 없이 이미 환경에 주입된 프로덕션 데이터베이스 자격 증명이 있는 
프로덕션 서버에 동일한 응용 프로그램 복사본을 배포할 수 있습니다.

> **참고** - 클라우드 네이티브 애플리케이션 개발시 준수해야하는 12가지 요소에 대한 
>자세한 내용을 읽을 수 있습니다 - [III. Config](https://12factor.net/config)

## Reading Environment Variables

Go를 사용하면 os 패키지를 사용하고 환경 변수의 문자열 이름을 전달하는 
`os.Getenv()`를 호출하여 환경 변수를 읽을 수 있습니다.

머신에서 `DATABASE_PASS`라는 환경 변수를 설정한 다음 애플리케이션에서 읽고 원하는 경우 
데이터베이스에 연결하는데 사용할 수 있습니다.

```bash
$ export DATABASE_PASS=unicorns
```

>**참고** - MacOS를 사용하여이 자습서를 작성하고 있습니다. 
>Windows를 사용하는 경우 `set DATABASE_PASS = unicorns`를 사용해야 할 수도 있습니다.

다음으로 이 `DATABASE_PASS`에서 읽을 수있는 Go 프로그램을 작성해 보겠습니다.

```go 
package main

import (
    "fmt"
    "os"
)

func main() {
    fmt.Println("Reading Environment Variable")
    var databasePass string
    databasePass = os.Getenv("DATABASE_PASS")
    fmt.Printf("Database Password: %s\n", databasePass)
}
```

이제 이것을 실행하면 다음과 같은 결과가 나타납니다.

```bash
$ go run main.go
Reading Environment Variable
Database Password: unicorns
```

놀랍게도 응용 프로그램은이 환경 변수를 성공적으로 선택하고 `fmt.Printf`에 대한 간단한 호출을 사용하여 
인쇄할 수 있었습니다.

## Setting Environment Variables

Go는 또한 원하는 경우 환경 변수를 설정할 수 있습니다. 
`os` 패키지를 다시 활용하고 `os.Setenv()`를 호출하면 됩니다.

```go 
package main

import (
    "fmt"
    "os"
)

func main() {
    fmt.Println("Reading Environment Variable")
    var databasePass string
    databasePass = os.Getenv("DATABASE_PASS")
    fmt.Printf("Database Password: %s\n", databasePass)

    err := os.Setenv("DATABASE_PASS", "newunicorns")
    if err != nil {
        fmt.Println(err)
    }
    databasePass = os.Getenv("DATABASE_PASS")
    fmt.Printf("Database Password: %s\n", databasePass)
}
```

계속 진행하면 환경 변수 변경 사항이 적용됩니다.

```bash
$ go run main.go
Reading Environment Variable
Database Password: unicorns
Database Password: newunicorns
```

>**참고** - 이 작업을 다시 실행하면 유니콘이 다시 `DATABASE_PASS`의 원래 값으로 선택됩니다. 
>자식 프로세스는 부모 프로세스의 환경 변수를 변경할 수 없기 때문입니다. 
>모든 변경 사항은 Go 프로그램에만 적용됩니다.

## Feature Flags

Go 프로그램 내에서 환경 변수를 흥미롭게 사용하는 기능은 `Feature Flags` 또는 `Feature Toggles`입니다. 
이러한 feature flags는 본질적으로 배포시 유연성을 제공하여 문제 발생시 새로운 features를 끄고 
이전 features로 되돌릴 수 있습니다.

>**참고** - 이전에 `feature Flags/Toggles`에 대해 들어 보지 못한 경우 
>Martin Fowler의 [Feature Flags/Toggles](https://martinfowler.com/articles/feature-toggles.html)에서
>이 기사를 확인하는 것이 좋습니다.

간단한 REST API를 예로 들어 보겠습니다:

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
)

func homePage(w http.ResponseWriter, r *http.Request) {
    if os.Getenv("FEATURE_TOGGLE") == "TRUE" {
        fmt.Println(os.Getenv("FEATURE_TOGGLE"))
        fmt.Fprintf(w, "Exciting New Feature")
    } else {
        fmt.Println(os.Getenv("FEATURE_TOGGLE"))
        fmt.Fprintf(w, "existing boring feature")
    }
}

func handleRequests() {
    http.HandleFunc("/", homePage)
    log.Fatal(http.ListenAndServe(":8081", nil))
}

func main() {
    handleRequests()
}
```

`FEATURE_TOGGLE` 환경 변수를 `TRUE`로 설정하여 이 응용 프로그램을 시작할 수 있습니다.
이 기능은 “Exciting New Feature”를 활성화하지만 프로덕션 환경에서 이 새 feature를 실행한 후에 
문제가 발생하면 프로세스를 종료하고 환경 변수를 변경할 수 있습니다. 
응용 프로그램을 빠르게 다시 시작하기 전에 `FALSE`로 설정하십시오.

분산 시스템에서 이 downtime은 애플리케이션 인스턴스가 다운된 상태에서 로드 밸런서 그룹에서 제거된 다음 
다시 로드 밸런서 그룹에 다시 추가되는 것을 볼 수 있습니다.

## Setup Of Environment Variables

보다 복잡한 응용 프로그램에서는 응용 프로그램을 시작하기 전에 
수백 가지의 다른 환경 변수를 설정해야하는 경우가 있습니다.

이제 이러한 환경 변수를 관리할 때 여러 가지 기술이 있습니다. 
안타깝게도 이는 “fuzzy” 답변을 제공하는 것입니다. 
조직마다 보안 기준이 다르기 때문에 완벽하게 유효한 솔루션이 적합하지 않습니다.

>**참고** – 자격 증명 보안은 올바른 자격을 얻기 위해 많은 시간과 노력이 필요합니다. 
>이것들은 단지 제안일 뿐이지만, 귀하의 팀에 적합한 솔루션을 찾아보아야 합니다.

* **git-crypt** - `AGWA/git-crypt` - git repo에서 파일의 투명한 암호화/암호 해독을 허용합니다.
이를 통해 bash 파일을 암호화하여 구성을 설정하고 실행할 때 해독할 수 있습니다.
* **AWS SSM** - [https://aws.amazon.com/secrets-manager/](https://aws.amazon.com/secrets-manager/)-AWS 관련 키트로 작업하는 경우 서비스를 통해 자격 증명을 관리할 수 있습니다.
* **Within your CI/CD Tool** - [예 - https://travis-ci.org/](https://travis-ci.org/) - 서비스에 환경 자격 증명을 한 번 주입하고 
수동 단계만으로 빌드 작업에 자동으로 주입할 수 있도록합니다.

이것들은 몇 가지 잠재적 인 제안 일뿐입니다. 
프로덕션 환경에서 이를 안전한 방식으로 처리하는 방법에 대한 정보를 제공하기를 바랍니다.

## Conclusion

따라서 이 포스트에서는 Go에서 환경 변수 읽기 및 쓰기와 이러한 환경 변수를 사용하여 
기능 플래그 또는 애플리케이션 내 기능 토글을 구현하는 방법에 대해 설명했습니다.