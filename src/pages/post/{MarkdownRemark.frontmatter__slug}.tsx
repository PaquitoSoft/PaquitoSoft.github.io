import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import Layout from "../../components/layout/layout";
import Card from "../../components/card/card";

function PostDetail({ data }) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  return (
		<Layout>
      <Helmet>
        <title>{frontmatter.title}</title>
        <meta name="date" content={frontmatter.creationDate} />
        <meta name="keywords" content={frontmatter.keywords} />
      </Helmet>
      <Card>
        <Card.Header>
          <h3>{frontmatter.title}</h3>
        </Card.Header>
        <Card.Body>
          <span dangerouslySetInnerHTML={{ __html: html }}></span>
        </Card.Body>
        <Card.Footer>
          <div>Published: {new Date(frontmatter.creationDate).toLocaleDateString()}</div>
        </Card.Footer>
      </Card>
		</Layout>
	);
};

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        creationDate
        slug
        title
      }
    }
  }
`

export default PostDetail;
