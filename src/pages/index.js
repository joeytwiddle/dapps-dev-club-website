import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';

import Layout from '../components/Layout';
import { HTMLContent } from '../components/Content';
import Img from 'gatsby-image';

function renderPostSummary({ node: post }) {
  const { featuredImage } = post.frontmatter;

  let headerImage;
  if (featuredImage) {
    headerImage = (<Img
      sizes={featuredImage.childImageSharp.sizes}
    ></Img>)
  } else {
    headerImage = null;
  }

  return (
    <div
      className="content"
      style={{ border: '1px solid #333', padding: '2em 4em' }}
      key={post.id}
    >
      <p>
        <Link className="has-text-primary" to={post.fields.slug}>
          {post.frontmatter.title}
        </Link>
        <span> &bull; </span>
        <small>{post.frontmatter.date}</small>
      </p>
      <div>
        {headerImage}
        <HTMLContent content={post.excerpt}>
        </HTMLContent>
        <br />
        <Link className="button is-small" to={post.fields.slug}>
          Keep Reading →
        </Link>
      </div>
    </div>
  );
}

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">Latest Stories</h1>
            </div>
            {posts
              .map(renderPostSummary)}
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: {
        templateKey: { eq: "blog-post" },
        draft: { ne: true }
      }},
    ) {
      edges {
        node {
          excerpt(
            pruneLength: 400
            format: HTML
          )
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            featuredImage {
              childImageSharp{
                  sizes(
                    maxHeight: 20
                    maxWidth: 100
                    quality: 70
                    grayscale: true
                    cropFocus: CENTER
                  ) {
                      ...GatsbyImageSharpSizes
                  }
              }
            }
          }
        }
      }
    }
  }
`
