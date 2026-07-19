import { useEffect } from 'react'

function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · दास्तान` : 'दास्तान — Hindi & Regional Stories'

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = description
    }
  }, [title, description])
}

export default usePageTitle