Feature: Login

  As a User I want to be able to log in with my credentials

  Scenario: Logging in
    Given We have logged in as "fake.email90@gmail.com" with password "abc123!@#"

  Scenario: Logging out
    Given We have logged in as "fake.email90@gmail.com" with password "abc123!@#"
    When I click on element "Logout"
    Then Page title should not be "Merchant Dashboard"