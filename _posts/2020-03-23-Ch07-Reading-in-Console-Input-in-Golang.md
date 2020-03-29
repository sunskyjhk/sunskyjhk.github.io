---
layout: post
title: "Go 프로그램으로 콘솔 입력 읽기오기"
author: Sun
date: 2020-03-23 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "Go(GoLang) 프로그램으로 콘솔 텍스트 입력을 읽는 방법에 대한 빠르고 간단한 포스팅입니다. 
이 포스트에서는 모든 사용자 입력을 읽고 사용자에게 다시 에코하는 매우 간단한 쉘의 기반을 만들 것입니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#readinginFullSentences">전체 문장 읽기</a>
      </li>
      <li>
        <a href="#readingSingleUTF8EncodedUnicodeCharacters">single UTF-8로 인코딩된 유니코드 문자 읽기</a>
      </li>
      <li>
        <a href="#usingBufiosScanner">Bufio의 Scanner 사용하기</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

Go(GoLang) 프로그램으로 콘솔 텍스트 입력을 읽는 방법에 대한 빠르고 간단한 포스팅입니다. 
이 포스트에서는 모든 사용자 입력을 읽고 사용자에게 다시 에코하는 매우 간단한 쉘의 기반을 만들 것입니다.

<h3 id="readinginFullSentences">
  <a href="#readinginFullSentences"></a>
  전체 문장 읽기
</h3>

매개변수 없이 for 루프와 동등한 Go's while 루프를 사용하여 프로그램이 종료되지 않고 계속 지속되도록 합니다. 
이 예에서는 텍스트를 입력한 다음 Enter를 누를 때마다 `\n` 특수 문자를 포함하여 모든 문자와 동일하게 텍스트를 할당합니다. 
방금 입력한 문자열을 비교하려면 `strings.Replace` 메소드를 사용하여 이 입력시 뒤따르는 `\n` 문자를 제거하고 비교를 수행하십시오.

> 주의 - Windows 시스템에서이 작업을 수행하려면 Windows에서 UNIX 시스템과 다른 줄 끝을 
>사용하므로 `text = strings.Replace (text, "\r\n", "", -1)`을 수행해야 합니다.

```go
package main

import (
  "bufio"
  "fmt"
  "os"
  "strings"
)

func main() {

  reader := bufio.NewReader(os.Stdin)
  fmt.Println("Simple Shell")
  fmt.Println("---------------------")

  for {
    fmt.Print("-> ")
    text, _ := reader.ReadString('\n')
    // convert CRLF to LF
    text = strings.Replace(text, "\n", "", -1)

    if strings.Compare("hi", text) == 0 {
      fmt.Println("hello, Yourself")
    }

  }

}
```
이 예에서 "hi"라는 단어를 입력 할 때마다 strings.Compare 메소드는 0을 반환하고 hello를 다시 인쇄합니다.

<h3 id="readingSingleUTF8EncodedUnicodeCharacters">
  <a href="#readingSingleUTF8EncodedUnicodeCharacters"></a>
  single UTF-8로 인코딩된 유니코드 문자 읽기
</h3>

명령 줄에서 하나의 유니 코드 문자를 간단히 읽으려면 다음과 같이 bufio.ReadRune을 사용하는 것이 좋습니다.

```go
reader := bufio.NewReader(os.Stdin)
char, _, err := reader.ReadRune()

if err != nil {
  fmt.Println(err)
}

// print out the unicode value i.e. A -> 65, a -> 97
fmt.Println(char)

switch char {
case 'A':
  fmt.Println("A Key Pressed")
  break
case 'a':
  fmt.Println("a Key Pressed")
  break
}
```

<h3 id="usingBufiosScanner">
  <a href="#usingBufiosScanner"></a>
  Bufio의 Scanner 사용하기
</h3>

콘솔에서 입력 내용을 읽을 수 있는 세 번째 방법은 새 스캐너를 만들고 `os.Stdin`을 전달하는 것입니다. 
위와 같이 새 reader를 만든 다음 스캐너를 사용하여 콘솔에서 읽을 수 있습니다.

```go
func scanner() {
  scanner := bufio.NewScanner(os.Stdin)
  for scanner.Scan() {
    fmt.Println(scanner.Text())
  }
}
```

위의 코드는 입력을 위해 스캔을 무한히 요청하고 입력된 내용을 에코합니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

보시다시피 여러 가지 방법이 있으며 최상의 솔루션은 특정 요구 사항에 따라 다릅니다. 
단일 문자 입력만 필요한 경우 `ReadRune()`을 사용하거나 
완전히 새로운 줄로 구분된 문장을 읽으려면 `ReadString`을 사용하십시오.