import React from 'react'
const HomePage = (props) => {
  return (
    <div
      className="jumbotron"
      style={{
        padding: '2rem 1rem',
        marginBottom: '2rem',
        backgroundColor: '#e9ecef',
        borderRadius: '.3rem',
      }}
    >
      <h1 className="display-3">Hello, word</h1>
      <p className="lead">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt,
        cumque mollitia dolores quidem cupiditate soluta magnam eaque eos quasi
        consequuntur eligendi odit quaerat illum vitae rem qui et. Rem, neque.
      </p>
      <hr className="my-4" />
      <p>fuvki</p>
      <p className="lead">
        <a href="" className="btn btn-primary btn-lg">
          Learn more
        </a>
      </p>
    </div>
  )
}

export default HomePage
