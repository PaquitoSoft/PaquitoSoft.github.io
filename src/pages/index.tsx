import * as React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet";

import Layout from "../components/layout/layout"
import PostSummary from "../components/post-summary/post-summary"

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;
  return (
    <Layout>
      <Helmet>
        <title>PaquitoSoft corner</title>
      </Helmet>
      
      <div>
        {posts.map(post => {
          const _post = {
            slug: post.frontmatter.slug,
            title: post.frontmatter.title,
            creationDate: new Date(post.frontmatter.creationDate),
            keywords: post.frontmatter.keywords,
            status: post.frontmatter.status,
            excerpt: post.excerpt,
            content: post.excerpt
          };
          return (
            <PostSummary key={_post.slug} post={_post} />
          );
        })}
			</div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query AllPosts {
    allMarkdownRemark(
      sort: {fields: frontmatter___creationDate, order: DESC}
      filter: {frontmatter: {status: {eq: "published"}}}
    ) {
      nodes {
        frontmatter {
          title
          slug
          creationDate
          keywords
          status
        }
        excerpt(format: HTML)
      }
    }
  }
`

export default IndexPage
