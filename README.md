# Gadwick

A website for bringing QA and DevOps into one stack

## Tech

This project uses:

* React
* HTML/CSS
* Auth0
* Express
* CRUD/REST APIs
* NodeJS / ExpressJS
* MYSQL
* RDS (Amazon Relational Database)
* Serverless

## Deployments

To deploy the backend, you can deploy with serverless using "cd gadwick-backend && serverless deploy"

## Principles

* QA Priorities should be driven by data.
* The communication barriers between QA and Developers should be broken down as much as possible. No more siloed test plans.
* Technical skill required to contribute to Continuous Integration should be kept to a minimum.

## User Goals

* CI developers should be able to easily get insight into problem areas and priorities for work.
* CI developers should quickly be able to plan out new tests and feature requirements.
* Gadwick should assist in CI development as much as possible to streamline the process of feature concepts to requirements and tests.
* Users should be able to quickly get set up.
* Users should be able to avoid manually entering data wherever possible.

## Feature Goals

* Analytics of test cases tested by QA.
* Analytics of test cases tested by CI.
* Ability to manage test case suite.
* Ability to walk through a feature/site and get requirement suggestions.
* Integration with CI tools.

## Feature Wishlist

* I want to be able to manage which users can do and see what on my project
* I want logins!
* I want to be able to be a part of many projects
* Reports / Report management
* Test case history
* Test Team management/scheduling?
* BDD structure for test generation?
* Link accounts so that when we update tickets in Gadwick they're reflected in Asana/JIRA/etc
* Google plugin to allow you to manage test results while on a website? (e.g. navigate around and easily click pass/fail)
* Macro/Recording of site navigation to generate tests?
* Link apps to boards, to allow webhooks to create new features

## Ideal Story

* BA writes feature up in whatever software they use
* QA Starts session and walks through product as prompted
* PM Can see the result of features reflected in their tracking software

## Test Structure

Each user should be able to view multiple Projects
A Project should have multiple Features
A feature should support multiple Requirements
At what level should automation threshold be done - per requirement or per feature?
