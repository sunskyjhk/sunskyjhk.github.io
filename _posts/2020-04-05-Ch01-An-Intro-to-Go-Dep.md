---
layout: post
title: "Go Dep 사용하기"
author: Sun
date: 2020-04-05 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go의 프로젝트 종속성을 관리하기 위해 이동 중에
Dep 도구를 사용하는 방법을 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#whydep">왜 dep인가?</a>
      </li>
      <li>
        <a href="#installation">설치하기</a>
      </li>
      <li>
        <a href="#depinit">dep init</a>
      </li>
      <li>
        <a href="#creating">새로운 프로젝트 만들기</a>
      </li>
      <li>
        <a href="#gopkgtoml">Gopkg.toml</a>
      </li>
      <li>
        <a href="#gopkglock">Gopkg.lock</a>
      </li>
      <li>
        <a href="#thevendor">The vendor/Directory</a>
      </li>
      <li>
        <a href="#helpfulCommands">유용한 명령어</a>
      </li>
      <li>
        <a href="#depensure">dep ensure</a>
      </li>
      <li>
        <a href="#addingDependencies">의존성 추가</a>
      </li>
      <li>
        <a href="#updatingDependencies">종속성 업데이트</a>
      </li>
      <li>
        <a href="#depstatus">dep status</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이 포스트에서는 Go의 프로젝트 종속성을 관리하기 위해 Go 에서
`Dep` 도구를 사용하는 방법을 살펴 보겠습니다.

<h3 id="whydep">
  <a href="#whydep"></a>
  왜 dep인가?
</h3>

`dep` 툴은 go 프로그래밍 언어를위한 "official experiment" 의존성 관리 툴입니다.
또한 많은 오버 헤드없이 프로젝트에서 유지 관리해야하는 종속성 목록을
관리하는데 도움이되며 시스템의 안정성을 보장하기 위해 특정 버전의 종속성에 고정할 수 있습니다.

종속성 관리 도구가 없으면 동일한 컴퓨터에서 여러 개의 다른 Go 프로그램을 개발할 때
많은 어려움을 겪을 수 있습니다.
머신에서 6개의 프로젝트가 사용하는 특정 종속성을 업데이트하면 small API 변경으로 인해
해당 프로젝트 중 3 개가 중단될 수 있습니다.

<h3 id="installation">
  <a href="#installation"></a>
  설치하기
</h3>

다음과 같이 homebrew를 사용하여 `dep` 도구를 설치할 수 있습니다.

```bash
$ brew install dep
$ brew upgrade dep
```

이 두 명령이 실행되면 터미널 내에서 `dep` CLI를 사용할 수 있어야합니다.

<h3 id="depinit">
  <a href="#depinit"></a>
  dep init
</h3>

`dep` 도구를 시작할 때 일반적으로 가장 먼저 실행해야하는 것은 `dep init` 명령입니다.
이 명령은 많은 작업을 수행하며 기존 Go 프로젝트와 최신 프로젝트에서 실행할 수 있습니다.

`dep init`를 호출하면 도구가 몇 가지 작업을 수행합니다.

1. 현재 프로젝트의 종속성을 식별합니다
2. 이러한 종속성이 **`dep`** 도구를 사용하는지 여부를 검증합니다.
3. 이러한 각 종속성에 대해 가장 호환 가능한 버전을 선택합니다.

<h3 id="creating">
  <a href="#creating"></a>
  새로운 프로젝트 만들기
</h3>

`dep`에 의존하는 새로운 프로젝트를 만들 때 몇 가지 옵션이 있습니다.
가장 좋은 첫 번째 옵션은 `$GOPATH` 내에 프로젝트를 만드는 것입니다.
평소와 같이 해당 디렉토리로 `cd` 한 다음 `dep init`를 호출하십시오:

```bash
$ mkdir -p $GOPATH/src/github.com/my/project
$ cd $GOPATH/src/github.com/my/project
$ dep init
$ ls
Gopkg.toml Gopkg.lock vendor/
```

<h3 id="gopkgtoml">
  <a href="#gopkgtoml"></a>
  Gopkg.toml
</h3>

`Gopkg.toml` 파일은 프로젝트에서 사용하려는 종속성 및 특정 버전의 종속성을 지정하는 위치입니다.
`NodeJS` 백그라운드에서 오는 경우 이것을 `package.json`으로,
`Java` 백그라운드에서 오는 경우 `pom.xml`로 생각하십시오.

<h3 id="gopkglock">
  <a href="#gopkglock"></a>
  Gopkg.lock
</h3>

`Gopkg.lock` 파일은 일련의 `[[project]]` stanzas로 표현되는 프로젝트의 종속성 그래프를
전이적으로 완성한 스냅 샷입니다.

일반 유저의 관점에서 이것은 모든 의존성과 그 의존성을 수정한 것의 목록입니다.

<h3 id="thevendor">
  <a href="#thevendor"></a>
  The vendor/Directory
</h3>

`vendor/directory`는 종속성이 저장된 위치입니다.
`NodeJS` 프로젝트의 `node_modules/directory`와 동일합니다.

<h3 id="helpfulCommands">
  <a href="#helpfulCommands"></a>
  유용한 명령어
</h3>

`dep` 명령에는 총 5개의 명령이 있습니다:

* `init` - 새로운 Go 프로젝트를 설정합니다.
* `status` - 프로젝트의 종속성 상태를 보고합니다.
* `ensure` - 프로젝트에서 의존성이 안전하게 벤더되도록 보장합니다.
* `prune` - 종속성을 정리합니다. 이 또한 자동으로 `수행`됩니다.
* `version` - `dep` 버전 정보를 표시합니다

일반적으로 처음 3 개의 명령으로만 작업하므로 이에 대해 자세히 설명하겠습니다.

<h3 id="depensure">
  <a href="#depensure"></a>
  dep ensure
</h3>

`dep ensure` 명령은 `dep` 종속성 관리 도구를 사용할 때 고려해야 할 가장 중요한 명령입니다.

<h3 id="addingDependencies">
  <a href="#addingDependencies"></a>
  의존성 추가
</h3>

프로젝트에 새로운 종속성을 추가하려면
`dep ensure -add` 명령을 호출하고 프로젝트의 소스를 지정하여 추가할 수 있습니다.

```bash
$ dep ensure -add github.com/foo/bar github.com/another/project ...
```

<h3 id="updatingDependencies">
  <a href="#updatingDependencies"></a>
  종속성 업데이트
</h3>

프로젝트 내의 일부 종속성을 업데이트하려면
`dep ensure`를 호출할 때 ``-update` 플래그를 사용하여 이를 수행할 수 있습니다.

```bash
// dry run testing an update
$ dep ensure -update -n
// non-dry run
$ dep ensure -update
// updates a specific package
$ dep ensure -update github.com/gorilla/mux
// updates to a specific version
$ dep ensure -update github.com/gorilla/mux@1.0.0
```

<h3 id="depstatus">
  <a href="#depstatus"></a>
  dep status
</h3>

`dep status` 명령은 프로젝트의 종속성 상태를 보고합니다.

```bash
$ dep status
// output
...
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이번 포스트에서 `dep` 도구를 시작하는데 필요한 모든 것을 살펴보았습니다.
