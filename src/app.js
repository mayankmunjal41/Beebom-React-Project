import React from 'react'
import fetch from 'isomorphic-fetch'
import ReactDOM from 'react-dom';
import '../css/index.css';


class App extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Beebom India News</h1>
        <NewsList />
      </div>
    );
  }
}


class NewsList extends React.Component {
  state = {
    news: [],
    per: 10,
    page: 1,
    totalPages: null,
    hasMore: true,
    scrolling: false
  }


  componentWillMount() {
    this.loadContacts()
    this.scrollListener = window.addEventListener('scroll', (e) => {
      this.handleScroll(e);
    })

  }

  handleScroll = (e) => {
    const {scrolling, totalPages, page} = this.state
    if (scrolling) return
    if (totalPages <= page) return
    var lastLi = document.querySelector('ul.news-list > li:last-child')
    var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight
    var pageOffset = window.pageYOffset + window.innerHeight
    var bottomOffset = 20
    if (pageOffset > lastLiOffset - bottomOffset) {
      this.loadMore()
    }


  }

  loadContacts = () => {

    const url = `https://newsapi.org/v2/everything?q=beebom+India&PageSize=${this.state.per}&page=${this.state.page}&apiKey=233008eb44b84f0abf42303faa0ba3da`
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({
        news: [...this.state.news, ...json.articles],
        scrolling: false,
        totalPages: json.total_pages
      }))
  }

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page+1,
      scrolling: true,
    }), this.loadContacts)
  }

  render() {
    return <ul className="news-list news-container">

        {
          this.state.news.map(news =><li key={news.url}>
            <News {...news}  />
            </li>
          )
        }

    </ul>
  }
}


const News = (props) => (

  <div className="news">
      <div><h2>{props.title}</h2></div>
      <div>{props.description}</div>
      <div className="list"> <a href={props.url} target="blank">Read More</a></div>
  </div>
);


ReactDOM.render(<App />, document.getElementById('app'))
