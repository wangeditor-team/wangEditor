;(function () {
  function deepClone(obj) {
    const str = JSON.stringify(obj)
    return JSON.parse(str)
  }

  const header = {
    type: 'header1',
    children: [
      {
        text: '水浒传简介',
      },
    ],
  }
  const text1 =
    '全书通过描写梁山好汉反抗欺压、水泊梁山壮大和受宋朝招安，以及受招安后为宋朝征战，最终消亡的宏大故事，艺术地反映了中国历史上宋江起义从发生、发展直至失败的全过程，深刻揭示了起义的社会根源，满腔热情地歌颂了起义英雄的反抗斗争和他们的社会理想，也具体揭示了起义失败的内在历史原因。'
  const text2 =
    '《水浒传》是中国古典四大名著之一，问世后，在社会上产生了巨大的影响，成了后世中国小说创作的典范。《水浒传》是中国历史上最早用白话文写成的章回小说之一，流传极广，脍炙人口；同时也是汉语言文学中具备史诗特征的作品之一，对中国乃至东亚的叙事文学都有深远的影响。'
  const p1 = {
    type: 'paragraph',
    children: [{ text: text1 }],
  }
  const p2 = {
    type: 'paragraph',
    children: [{ text: text2 }],
  }
  // const code = {
  //   type: 'pre',
  //   children: [
  //     {
  //       type: 'code',
  //       language: 'javascript',
  //       children: [{ text: 'const a = 100;' }],
  //     },
  //   ],
  // }

  // 拼接大文件
  window.HUGE_CONTENT = []
  for (let i = 0; i < 370; i++) {
    window.HUGE_CONTENT.push(deepClone(header))
    window.HUGE_CONTENT.push(deepClone(p1))
    window.HUGE_CONTENT.push(deepClone(p2))
    // window.HUGE_CONTENT.push(deepClone(code))
  }
})()
