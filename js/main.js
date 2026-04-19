/* Menu (show/hidden) */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close")

/* Menu (show) */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu")
  })
}

/* Menu (hidden) */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
  })
}

/* Mobile menu */
const navLink = document.querySelectorAll(".nav-link")

function linkAction() {
  const navMenu = document.getElementById("nav-menu")
  navMenu.classList.remove("show-menu")
}
navLink.forEach((n) => n.addEventListener("click", linkAction))



/* Experience tabs */
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]")

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target)

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("experience-active")
    })
    target.classList.add("experience-active")

    tabs.forEach((tab) => {
      tab.classList.remove("experience-active")
    })
    tab.classList.add("experience-active")
  })
})

/* Experience Carousel Navigation */
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const experienceCarousel = document.querySelector(".experience-carousel")
const experienceSlider = document.querySelector(".experience-slider")

if (prevBtn && nextBtn && experienceCarousel && experienceSlider) {
  // Get all initial cards
  const initialCards = Array.from(experienceSlider.querySelectorAll(".experience-card"))
  
  // Clone cards for seamless looping
  initialCards.forEach(card => {
    const clone = card.cloneNode(true)
    experienceSlider.appendChild(clone)
  })
  
  const cardWidth = 350 // card width
  const gap = 32 // gap between cards
  const scrollAmount = cardWidth + gap
  
  prevBtn.addEventListener("click", () => {
    experienceSlider.style.animationPlayState = "paused"
    experienceCarousel.scrollLeft -= scrollAmount
  })

  nextBtn.addEventListener("click", () => {
    experienceSlider.style.animationPlayState = "paused"
    experienceCarousel.scrollLeft += scrollAmount
  })
  
  // Resume animation when not clicking buttons after 2 seconds
  let animationTimeout
  const resumeAnimation = () => {
    clearTimeout(animationTimeout)
    animationTimeout = setTimeout(() => {
      experienceSlider.style.animationPlayState = "running"
    }, 2000)
  }
  
  prevBtn.addEventListener("click", resumeAnimation)
  nextBtn.addEventListener("click", resumeAnimation)
}

/* Auto-tag events as Past / Upcoming */
document.querySelectorAll(".event-card[data-event-date]").forEach(card => {
  const raw = card.getAttribute("data-event-date")
  if (!raw) return
  const [year, month] = raw.split("-").map(Number)
  const now = new Date()
  const eventEnd = new Date(year, month, 0) // last day of that month
  const isPast = now > eventEnd
  const badge = document.createElement("span")
  badge.className = isPast ? "event-status event-status-past" : "event-status event-status-upcoming"
  badge.textContent = isPast ? "Past" : "Upcoming"
  card.querySelector(".event-card-header").appendChild(badge)
})

/* Events Carousel Navigation */
const eventsPrevBtn = document.getElementById("eventsPrevBtn")
const eventsNextBtn = document.getElementById("eventsNextBtn")
const eventsCarousel = document.querySelector(".events-carousel")
const eventsSlider = document.querySelector(".events-slider")

if (eventsPrevBtn && eventsNextBtn && eventsCarousel && eventsSlider) {
  const initialEventCards = Array.from(eventsSlider.querySelectorAll(".event-card"))

  initialEventCards.forEach(card => {
    const clone = card.cloneNode(true)
    eventsSlider.appendChild(clone)
  })

  const eventCardWidth = 420
  const eventGap = 32
  const eventScrollAmount = eventCardWidth + eventGap

  eventsPrevBtn.addEventListener("click", () => {
    eventsSlider.style.animationPlayState = "paused"
    eventsCarousel.scrollLeft -= eventScrollAmount
  })

  eventsNextBtn.addEventListener("click", () => {
    eventsSlider.style.animationPlayState = "paused"
    eventsCarousel.scrollLeft += eventScrollAmount
  })

  let eventsAnimTimeout
  const resumeEventsAnimation = () => {
    clearTimeout(eventsAnimTimeout)
    eventsAnimTimeout = setTimeout(() => {
      eventsSlider.style.animationPlayState = "running"
    }, 2000)
  }

  eventsPrevBtn.addEventListener("click", resumeEventsAnimation)
  eventsNextBtn.addEventListener("click", resumeEventsAnimation)
}

/* Articles - no carousel needed */

/* Scroll sections (active link) */
const sections = document.querySelectorAll("section[id]")

function scrollActive() {
  const scrollY = window.pageYOffset

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight
    const sectionTop = current.offsetTop - 50
    const sectionId = current.getAttribute("id")

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("active-link")
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("active-link")
    }
  })
}
window.addEventListener("scroll", scrollActive)

/* Background header */
function scrollHeader() {
  const nav = document.getElementById("header")

  if (this.scrollY >= 80) nav.classList.add("scroll-header")
  else nav.classList.remove("scroll-header")
}
window.addEventListener("scroll", scrollHeader)

/* Show scroll to top */
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up")

  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll")
  else scrollUp.classList.remove("show-scroll")
}
window.addEventListener("scroll", scrollUp)

/* Dark/Light mode */
const themeButton = document.getElementById("theme-button")
const darkTheme = "dark-theme"
const iconTheme = "fa-sun"

const selectedTheme = localStorage.getItem("selected-theme")
const selectedIcon = localStorage.getItem("selected-icon")

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light"
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun"

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme)
  themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](iconTheme)
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme)
  themeButton.classList.toggle(iconTheme)

  localStorage.setItem("selected-theme", getCurrentTheme())
  localStorage.setItem("selected-icon", getCurrentIcon())
})

/* Mail integration */
document.addEventListener("DOMContentLoaded", function () {
  // Fetch Medium articles immediately (independent of emailjs)
  fetchMediumArticles()

  // Initialize emailjs separately so a failure doesn't block articles
  try {
    emailjs.init("A_K7ptC5vuZYam6qG")
  } catch (e) {
    console.warn('emailjs init failed:', e)
  }
})

document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault()

  emailjs.sendForm('service_k16cehm', 'template_cq4lg79', this)
    .then(function (response) {
      console.log('Success!', response.status, response.text)
      alert('Email sent! Against all odds, it worked!')
      document.getElementById('contact-form').reset()
    }, function (error) {
      console.log('Failed...', error)
      alert('Email sending failed.')
    })
})

/* Sample articles fallback */
const sampleArticles = [
  {
    title: "Building Scalable Backend Systems with Python",
    link: "https://medium.com/@badrvkacimi",
    pubDate: new Date(2024, 10, 15).toISOString()
  },
  {
    title: "Financial Data Processing in Banking Systems",
    link: "https://medium.com/@badrvkacimi",
    pubDate: new Date(2024, 10, 8).toISOString()
  },
  {
    title: "Microservices Architecture Best Practices",
    link: "https://medium.com/@badrvkacimi",
    pubDate: new Date(2024, 9, 25).toISOString()
  },
  {
    title: "Trade Finance Solutions for Modern Commerce",
    link: "https://medium.com/@badrvkacimi",
    pubDate: new Date(2024, 9, 18).toISOString()
  },
  {
    title: "API Design Patterns and Best Practices",
    link: "https://medium.com/@badrvkacimi",
    pubDate: new Date(2024, 9, 10).toISOString()
  },
  {
    title: "Cloud Infrastructure Optimization Strategies",
    link: "https://medium.com/@badrvkacimi",
    pubDate: new Date(2024, 8, 28).toISOString()
  }
]

/* Fetch Medium Articles from RSS Feed */
function fetchMediumArticles() {
  const mediumFeedElement = document.getElementById('medium-feed')
  if (!mediumFeedElement) return

  const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://medium.com/feed/@badrvkacimi')

  fetch(rssUrl)
    .then(function(response) { return response.json() })
    .then(function(data) {
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const articles = data.items.map(function(item) {
          // Extract thumbnail: try thumbnail field first, then parse first <img> from description/content
          var thumb = item.thumbnail || ''
          if (!thumb && item.description) {
            var imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/)
            if (imgMatch) thumb = imgMatch[1]
          }
          if (!thumb && item.content) {
            var contentMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/)
            if (contentMatch) thumb = contentMatch[1]
          }
          // Extract a short description text (strip HTML)
          var descText = ''
          if (item.description) {
            descText = item.description.replace(/<[^>]*>/g, '').trim().substring(0, 120)
            if (item.description.replace(/<[^>]*>/g, '').trim().length > 120) descText += '...'
          }
          return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: thumb,
            excerpt: descText
          }
        })
        displayArticles(articles, mediumFeedElement)
      } else {
        displayArticles(sampleArticles, mediumFeedElement)
      }
    })
    .catch(function() {
      displayArticles(sampleArticles, mediumFeedElement)
    })
}

function displayArticles(articles, container) {
  container.innerHTML = ''

  if (!articles || articles.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">No articles available.</p>'
    return
  }

  // Show only the last 5 articles
  var latestArticles = articles.slice(0, 5)

  latestArticles.forEach(function(article) {
    var card = createMediumArticleCard(article)
    container.appendChild(card)
  })
}

function createMediumArticleCard(article) {
  var card = document.createElement('div')
  card.className = 'medium-article-card'
  
  // Extract/construct article data
  var title = (article.title || 'Untitled Article').replace(/<[^>]*>/g, '').substring(0, 75)
  var link = article.link || article.url || 'https://medium.com/@badrvkacimi'
  var pubDate = article.pubDate || article.createdAt || new Date().toISOString()
  
  // Use thumbnail from Medium or fallback to placeholder
  var imageUrl = article.thumbnail || ''
  if (!imageUrl) {
    var colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F']
    var randomColor = colors[Math.floor(Math.random() * colors.length)]
    imageUrl = 'https://placehold.co/600x400/' + randomColor + '/FFFFFF?text=Article'
  }
  
  // Format date
  var formattedDate = new Date(pubDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short',
    day: 'numeric'
  })

  // Build card using DOM APIs to prevent XSS
  var imgWrapper = document.createElement('div')
  imgWrapper.className = 'medium-article-image'
  var img = document.createElement('img')
  img.src = imageUrl
  img.alt = title
  img.loading = 'lazy'
  imgWrapper.appendChild(img)

  var content = document.createElement('div')
  content.className = 'medium-article-content'

  var h3 = document.createElement('h3')
  h3.className = 'medium-article-title'
  h3.textContent = title

  // Add excerpt if available
  var excerpt = article.excerpt || ''
  if (excerpt) {
    var excerptEl = document.createElement('p')
    excerptEl.className = 'medium-article-excerpt'
    excerptEl.textContent = excerpt
    content.appendChild(h3)
    content.appendChild(excerptEl)
  } else {
    content.appendChild(h3)
  }

  var meta = document.createElement('p')
  meta.className = 'medium-article-meta'
  var calIcon = document.createElement('i')
  calIcon.className = 'fas fa-calendar-alt'
  meta.appendChild(calIcon)
  meta.appendChild(document.createTextNode(' ' + formattedDate))

  var a = document.createElement('a')
  a.href = link
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  a.className = 'medium-article-link'
  a.textContent = 'Read More '
  var arrowIcon = document.createElement('i')
  arrowIcon.className = 'fas fa-arrow-right'
  a.appendChild(arrowIcon)

  content.appendChild(meta)
  content.appendChild(a)

  card.appendChild(imgWrapper)
  card.appendChild(content)
  
  return card
}

// Removed duplicate call - fetchMediumArticles is called from DOMContentLoaded handler above
