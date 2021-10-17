import React from 'react'
import { Link } from 'react-router-dom'
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
      <h1 className="display-3">Bienvenue sur MY CRM</h1>
      <p className="lead">
        My CRM est une plateforme de gestion des relations avec la clientèle.
        Cette plateforme vous permet de gérer vos clients et leurs factures.
      </p>
      <hr className="my-4" />
      <p className="lead">
        <Link to="/customers" className="btn btn-primary btn-lg">
          Gestion clientèle
        </Link>
      </p>
    </div>
  )
}

export default HomePage
