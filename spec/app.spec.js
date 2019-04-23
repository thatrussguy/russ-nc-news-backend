process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");
const request = supertest(app);

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/topics", () => {
      it("GET status:200 returns a list of topics under key 'topics'", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("topics");
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("slug", "description");
          });
      });
    });
    describe("/articles", () => {
      it("GET status:200 returns a list of articles under key 'articles'", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("articles");
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      describe("/:article_id", () => {
        it("GET status:200 returns an article object under key 'article", () => {
          return request
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("article");
              expect(body.article).to.be.an("object");
              expect(body.article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it("PATCH status:200 increments votes by the amount specified by inc_votes in the body and returns the updated article", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(110);
            });
        });
      });
    });
  });
});
