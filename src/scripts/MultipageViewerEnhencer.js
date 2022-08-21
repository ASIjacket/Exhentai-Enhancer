/* eslint-disable no-undef */

const init = () => {
  'use strict'
  // currentpage: exhentai 內建變數，表示目前頁數
  // pagecount: exhentai 內建變數，表示總頁數
  // scroll_relative: exhentai 內建 function，實現 scrolling
  // preload_scroll_images: exhentai 內建 function，scroll 時根據目前頁數去 preload images

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    main()
  } else {
    document.addEventListener('DOMContentLoaded', main)
  }

  function main() {
    const featuresContainer = appendFeaturesContainer()

    setChangePageEvent(featuresContainer)

    featuresContainer.append(createImageHeightResizer())

    injectCss()
  }

  function appendFeaturesContainer() {
    const featuresContainer = document.createElement('div')
    featuresContainer.classList.add('enhencer-features')
    getElement('#pane_outer').append(featuresContainer)

    return featuresContainer
  }

  function setChangePageEvent(featuresContainer) {
    setMouseWheelEvent()

    /**
     * 若滾動時滑鼠在右側，直接換頁
     */
    function setMouseWheelEvent() {
      document.body
        .addEventListener('mousewheel', e => {
          hideCursor(e)
          setShowCursorEvent()

          // 以 features container 左側當作界線
          if (e.x >= featuresContainer.offsetLeft) {
            changePage(e)
          }
        },
        true)

      function changePage(e) {
        e.stopPropagation()

        if (Math.sign(e.deltaY) === -1) { // 滾輪向上
          goToPrevPage()
        } else { // 滾輪向下
          goToNextPage()
        }
      }
    }
  }

  function goToNextPage() {
    // pagecount 為 exhentai 內建變數，表示總共的頁數
    if (currentpage === pagecount) {
      return
    }

    goToPage(++currentpage)
  }

  function goToPrevPage() {
    if (currentpage === 1) {
      return
    }

    goToPage(--currentpage)
  }

  function goToPage(index) {
    currentpage = index
    document.getElementById(`image_${index}`).scrollIntoView()
  }


  let currentImageHeight = null

  /**
   * 產生一個可將圖片高度設定為特定高度的按鈕 (不會超過原圖最大高度)
   */
  function createImageHeightResizer() {
    const heightList = [100, 125, 150, 175, 200]

    const container = document.createElement('div')
    container.classList.add('enhencer-features__enhencer-feature', 'image-resizer')

    for (const height of heightList) {
      const fitButton = document.createElement('button')
      fitButton.classList.add('image-resizer__button', `image-resizer__button--${height}`)
      fitButton.innerText = height

      const imagesContainer = getElement('#pane_images')
      fitButton.addEventListener('click', () => {
        const containerActiveClass = 'resize'
        const buttonActiveClass = 'image-resizer__button--active'

        removeClassFromElements('.image-resizer__button', buttonActiveClass)

        if (height === currentImageHeight) {
          currentImageHeight = null
          imagesContainer.classList.remove(containerActiveClass)
          imagesContainer.style.removeProperty('--image-height')
        } else {
          addClassToElement(`.image-resizer__button--${height}`, buttonActiveClass)
          imagesContainer.classList.add(containerActiveClass)
          imagesContainer.style.setProperty('--image-height', `${height}vh`)
          currentImageHeight = height
        }

        goToPage(currentpage)
      })

      container.append(fitButton)
    }

    return container
  }

  function addClassToElement(selector, className) {
    getElement(selector)
      ?.classList
      ?.add(className)
  }

  function removeClassFromElements(selector, className) {
    getElements(selector).forEach(elem => {
      elem.classList.remove(className)
    })
  }

  function getElement(selector, doc = document) {
    return doc.querySelector(selector)
  }

  function getElements(selector, doc = document) {
    return doc.querySelectorAll(selector)
  }

  function injectCss() {
    const style = document.createElement('style')
    style.textContent = `
      .image-resizer {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 40px;
      }

      .image-resizer__button {
        padding: 0;
        width: 100%;
        height: 30px;
        border: #777 solid 1px;
        border-radius: 5px;
        background-color: transparent;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
      }

      .image-resizer__button:hover {
        background-color: #ffa50033;
      }

      .image-resizer__button--active,
      .image-resizer__button--active:hover {
        background-color: #ffa500;
      }
    `

    getElement('head').append(style)
  }
}

export default init
