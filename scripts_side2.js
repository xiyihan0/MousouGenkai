let currentPage = 1, chaptersPerPage = 5;

const chapters = [
  {
    title: "虚壹之章：潜入，以及虚实之虚 ~ 致新世界",
    shortTitle: "虚壹之章 故事",
    filePath: "cside2_1.txt",
    id: 1,
    summary: "<span class='syslang'>&nbsp&nbsp作者：Richado Wonosas&nbsp&nbsp</span><br><br>已知：世界是虚假的。<br>我等要如何行动？<br><br>那么，我等应潜入虚假的虚假，以探寻真实之真实——<br>此乃虚妄与现实纠缠的梦境伊始。",
  },
  {
    title: "虚贰之章：轮回，其为死生之生 ~ 生理毁灭",
    shortTitle: "虚贰之章 故事",
    filePath: "cside2_2.txt",
    id: 2,
    summary: "<span class='syslang'>&nbsp&nbsp作者：Richado Wonosas&nbsp&nbsp</span><br><br>布雷姆市南面不远处的森林之中，我开始了魔法特训。<br>只不过，此款游戏的技能学习机制一反传统，看来要花费不少功夫才能够习得真正有用的魔法。<br><br>实话说，换作传统的游戏的话，这样的特训恐怕没啥意义：毕竟在传统的游戏里，不打怪升级，就根本掌握不了新的技能。<br>但是，这里可是TBO的世界，一个就连开发了这款游戏的人都没法掌握它到底会做出什么的世界。<br>那么，作为可以与它交互的玩家，想必我的一举一动以及所思所想，也会辅助它成长、让它成为内容更加丰富的游戏吧。",
  },
];
const characterAvailability = {
  1: [1],
  2: [1],
};
const linktails = [
  {
    content: "也来浏览一下这些网站吧！",
    id: 1,
  },
];

var page = 0;
var listtext = document.getElementById("toggleTermList2");
listtext.innerHTML = `Pg.${page}`;

document.addEventListener("DOMContentLoaded", () => {
  const chapterList = document.getElementById("chapter-list"), chapterContent = document.getElementById("chapter-content"), tailLinks = document.getElementById("tail-links"), totalPages = Math.ceil(chapters.length / chaptersPerPage);

  async function displayChapterList() {
    chapterList.innerHTML = "";
    for (let i = (currentPage - 1) * chaptersPerPage; i < currentPage * chaptersPerPage && i < chapters.length; i++) {
      if (i != 4 || getCurrentPageIndex() == 4) {
        const listItem = document.createElement("li");
        listItem.classList.add("chapter-item");
        const titleElement = document.createElement("div");
        titleElement.textContent = chapters[i].title;
        const listLinker = document.createElement("a");
        listLinker.href = `mousou_side2_${i + 1}.html`;
        listItem.appendChild(listLinker);
        listLinker.appendChild(titleElement);
        listLinker.classList.add("chapter-link");
        const characterCount = await getCharacterCount(chapters[i].filePath);
        const characterCountElement = document.createElement("div"), readingTime = Math.round(characterCount / 1000);
        if (i == 4) {
          characterCountElement.textContent = `无规范时长 | ${Math.round(characterCount / 100)/100} 万字 `;
        } else {
        characterCountElement.textContent = `${readingTime} 分钟 | ${Math.round(characterCount / 100)/100} 万字 `;
        }
        characterCountElement.classList.add("chapter-character-count");
        listLinker.appendChild(characterCountElement);
        chapterList.appendChild(listItem);
      }
    }
    displayPagination(); setActiveChapterTitle();
  } 

  function displayPagination() {
    const pagination = document.createElement("div");
    pagination.className = "pagination";

    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.textContent = i;
      pageNumber.className = "page-number";
      pageNumber.addEventListener("click", () => {
        currentPage = i;
        displayChapterList();
      });

      if (i === currentPage) {
        pageNumber.classList.add("active");
      }

      pagination.appendChild(pageNumber);
    }

    chapterList.appendChild(pagination);
    resetPageDirect(pagination);
  }
  displayChapterList();

  async function displayChapter(index) {
    try {
      const response = await fetch(chapters[index].filePath);
      const content = await response.text();
      chapterContent.innerHTML = `<p>${content}</p>`;
      setCharacterAvailability(index + 1);
      displayChapterSummary(index);
    } catch (error) {
      chapterContent.innerHTML = `<br><br><h3>“纵使此世由纷争与妄想所交叠纠缠，<br>汝之心念终将凝成赴往真实的微光。”</h3><br><br>`;
      setCharacterAvailability(0);
      displayChapterSummary(0);
    }
    displayTailLinks(0);
  }

  function displayTailLinks(index) {
    tailLinks.innerHTML = `<p>${linktails[index].content}</p>`;
  }

  function setCharacterAvailability(chapterId) {
    const availableCharacters = characterAvailability[chapterId] || [];
    const tabSelectors = document.querySelectorAll(".tab-selector");
    const characterLabels = document.querySelectorAll(".character-tab");
    const termLabels = document.querySelectorAll(".term-tab");
  
    tabSelectors.forEach((selector, index) => {
      selector.disabled = !availableCharacters.includes(index + 1);
    });
  
    characterLabels.forEach((label, index) => {
      if (!availableCharacters.includes(index + 1)) {
        label.classList.add("disabled");
      } else {
        label.classList.remove("disabled");
      }
    });
    termLabels.forEach((label, index) => {
      label.classList.remove("disabled");
    });
  }

  function setActiveChapterTitle() {
    const chapterListItems = document.querySelectorAll("#chapter-list li");
    const currentPageIndex = getCurrentPageIndex();
    chapterListItems.forEach((item, i) => {
      if (i === currentPageIndex) {
        item.classList.add("active");
        item.classList.add("active-side2");
      } else {
        item.classList.remove("active");
        item.classList.remove("active-side2");
      }
    });
  }
  function getCurrentPageIndex() {
    const currentPath = window.location.pathname;
    const chapterIndexRegex = /mousou_side2_(\d+)\.html/;
    const match = currentPath.match(chapterIndexRegex);
  
    if (match) {
      return parseInt(match[1]) - 1;
    } else {
      return 0;
    }
  }

  document.getElementById("toggleCharacterList").addEventListener("click", function () {
    const termList = document.getElementById("character-tabs");
    const termList2 = document.getElementById("character-tabs2");
    const termList3 = document.getElementById("character-tabs3");
    const characterList = document.getElementById("term-tabs");
    const characterList2 = document.getElementById("term-tabs2");
    const characterList3 = document.getElementById("term-tabs3");
    var listtext = document.getElementById("toggleCharacterList2");
    characterList.classList.add("hidden");
    if (characterList2 != null) {
      characterList2.classList.add("hidden");
    }
    if (characterList3 != null) {
      characterList3.classList.add("hidden");
    }
    page += 1;
    if (!(page >= 0)) {
      page = 0;
    }
    if (page == 2 && termList2 == null) {
      page = 0;
    }
    if (page == 3 && termList3 == null) {
      page = 0;
    }
    listtext.innerHTML = `Pg.${page}`;
    if (page == 0) {
      termList.classList.add("hidden");
      termList2.classList.add("hidden");
      termList3.classList.add("hidden");
    }
    if (page == 1) {
      termList.classList.remove("hidden");
      termList2.classList.add("hidden");
      termList3.classList.add("hidden");
    }
    if (page == 2) {
      termList.classList.add("hidden");
      termList2.classList.remove("hidden");
      termList3.classList.add("hidden");
    }
    if (page == 3) {
      termList.classList.add("hidden");
      termList2.classList.add("hidden");
      termList3.classList.remove("hidden");
    }
  });
  document.getElementById("toggleTermList").addEventListener("click", function () {
    const termList = document.getElementById("term-tabs");
    const termList2 = document.getElementById("term-tabs2");
    const termList3 = document.getElementById("term-tabs3");
    const termList4 = document.getElementById("term-tabs4");
    const characterList = document.getElementById("character-tabs");
    const characterList2 = document.getElementById("character-tabs2");
    const characterList3 = document.getElementById("character-tabs3");
    var listtext = document.getElementById("toggleTermList2");
    characterList.classList.add("hidden");
    if (characterList2 != null) {
      characterList2.classList.add("hidden");
    }
    if (characterList3 != null) {
      characterList3.classList.add("hidden");
    }
    page += 1;
    if (!(page >= 0)) {
      page = 0;
    }
    if (page == 2 && termList2 == null) {
      page = 0;
    }
    if (page == 3 && termList3 == null) {
      page = 0;
    }
    if (page == 4 && termList4 == null) {
      page = 0;
    }
    listtext.innerHTML = `Pg.${page}`;
    if (page == 0) {
      termList.classList.add("hidden");
      termList2.classList.add("hidden");
      termList3.classList.add("hidden");
    }
    if (page == 1) {
      termList.classList.remove("hidden");
      termList2.classList.add("hidden");
      termList3.classList.add("hidden");
    }
    if (page == 2) {
      termList.classList.add("hidden");
      termList2.classList.remove("hidden");
      termList3.classList.add("hidden");
    }
    if (page == 3) {
      termList.classList.add("hidden");
      termList2.classList.add("hidden");
      termList3.classList.remove("hidden");
    }
  });
  document.getElementById("toggleWorldMap").addEventListener("mouseover", function () {
    const worldMap = document.getElementById("world-map");
    worldMap.classList.toggle("hidden");
  });
  document.getElementById("toggleWorldMap").addEventListener("mouseout", function () {
    const worldMap = document.getElementById("world-map");
    worldMap.classList.toggle("hidden");
  });

  async function getCharacterCount(filePath) {
    try {
      const response = await fetch(filePath);
      const content = await response.text();
      return content.length;
    } catch (error) {
      console.error("Error fetching chapter content for character count:", error);
      return 0;
    }
  }
  function displayChapterSummary(index) {
    const summaryBox = document.getElementById("chapter-summary");
    summaryBox.innerHTML = `<h3>${chapters[index].shortTitle}概览</h3><p>${chapters[index].summary}</p>`;
  }
  currentPage = 1;
  for (let i = 1; i <= getCurrentPageIndex(); i++) {
    if (i / 5 === 1) {
      currentPage += 1;
    }
  }
  displayChapter(getCurrentPageIndex()); 
  setActiveChapterTitle();
  
});


