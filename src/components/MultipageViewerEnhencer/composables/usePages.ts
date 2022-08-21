import { ref } from 'vue'

import { getElement, getElements } from '@/utils/commons'
import useElements from './useElements'

export default function() {
  /**
 * 於圖片資訊欄新增目前頁數/總共頁數
 */
  function appendPageIndex() {
    const imageContainers = getElements('.mi0') as NodeListOf<HTMLElement>
    const pageCount = imageContainers.length

    const mutationObserver = new MutationObserver(([mutation]) => {
      const target = mutation.target as HTMLElement
      const index = target.id.split('image_')[1]
      const captionElement = getElement('.mi4', target)
      const captionText = captionElement?.innerText

      if (!captionText || captionText?.includes(' ／ ')) {
        return
      }

      // eslint-disable-next-line no-irregular-whitespace
      captionElement.innerText = `${captionText}　-　${index} ／ ${pageCount}`
    })

    const config = { attributes: true }
    imageContainers.forEach(container => {
      mutationObserver.observe(container, config)
    })
  }

  const pageCount = window.pagecount
  const currentPage = ref(window.currentpage)

  function goToNextPage() {
    if (currentPage.value === window.pagecount) {
      return
    }

    goToPage(++currentPage.value)
  }

  function goToPrevPage() {
    if (currentPage.value === 1) {
      return
    }

    goToPage(--currentPage.value)
  }

  function goToPage(index: number) {
    window.currentpage = index

    currentPage.value = index
    const target = getElement(`#image_${index}`) as HTMLElement
    target.scrollIntoView()
  }

  const { paneImagesDiv } = useElements()

  /**
   * onscroll 時同時更新 currentpage 至 pageElevatorElem 的 value
   */
  function updateCurrentPageWhenScrolling() {
    paneImagesDiv.value.onscroll = () => {
      window.preload_scroll_images()
      currentPage.value = window.currentpage
    }
  }

  return {
    appendPageIndex,
    pageCount,
    currentPage,
    goToNextPage,
    goToPrevPage,
    goToPage,
    updateCurrentPageWhenScrolling,
  }
}
