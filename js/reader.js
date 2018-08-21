/* global $ */
// dom节点封装
let Dom = {
  window: $(window),
  document: $(document),
  htmlbody: $('html, body'),
  container: $('.container'),
  fictionContent: $('.fiction_content'),
  fictionPages: $('.fiction_pages ul li')
}
// 初始化章节
let chapterId = 1
// 所有章节
let totalChapterId = 4

// 上一页
Dom.fictionPages.eq(0).click(function () {
  if (Number.parseInt(chapterId) === 1) {
    window.alert('这个第一个章节')
    return
  }
  chapterId--
  // 获取数据
  step2(chapterId)
    .then(val => step3(val))
    .then(val => chapterContentRender(val))
    .catch(error => window.alert(error))
  //
  Dom.htmlbody.animate({ scrollTop: 0 }, 'fast')
})
// 下一页
Dom.fictionPages.eq(1).click(function () {
  if (Number.parseInt(chapterId) === totalChapterId) {
    window.alert('这个最后一个章节')
    return
  }
  chapterId++
  // 获取数据
  step2(chapterId)
    .then(val => step3(val))
    .then(val => chapterContentRender(val))
    .catch(error => window.alert(error))
  //
  Dom.htmlbody.animate({ scrollTop: 0 }, 'fast')
})
// 文章内容渲染
function chapterContentRender (data) {
  let realdata = JSON.parse(data)
  // 拼接html
  let html = `<h4>${realdata.t}</h4>`
  realdata.p.forEach(element => {
    html += `<p>${element}</p>`
  })
  Dom.fictionContent.html('')
  Dom.fictionContent.html(html)
}

step1()
  .then(val => step2(val))
  .then(val => step3(val))
  .then(val => chapterContentRender(val))
  .catch(error => window.alert(error))

function step1 () {
  return new Promise((resolve, reject) => {
    $.get('../data/chapter.json', function (result) {
      if (result.result === 0) {
        let chapters = result.chapters
        chapterId = chapters[0].chapter_id + 1
        resolve(chapterId)
      } else {
        reject(new Error('数据获取异常'))
      }
    })
  })
}

function step2 (chapterId) {
  return new Promise((resolve, reject) => {
    $.get(`../data/data${chapterId}.json`, function (result) {
      if (result.result === 0) {
        let url = result.jsonp
        resolve(url)
      } else {
        reject(new Error('数据获取异常'))
      }
    })
  })
}

function step3 (url) {
  return new Promise((resolve, reject) => {
    $.jsonp({
      url: url,
      cache: true,
      callback: 'duokan_fiction_chapter',
      success: function (result) {
        if (result) {
          let data = $.base64.decode(result)
          let json = decodeURIComponent(escape(data))
          resolve(json)
        }
      }
    })
  })
}
