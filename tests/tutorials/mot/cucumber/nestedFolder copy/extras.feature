Feature: Extra Groups

  As a User I want to be able to manage Extra Groups

  Scenario: Adding/Removing extras
    Given We have logged in as "fake.email90@gmail.com" with password "abc123!@#"
    When I click on element "Products"
    When I click on sidebar button "Extras"

    When I click on element "Test Extras"
    When I click on element "New Item"
    Then "New Item" should be in the group
    When I click on "Submit"
    When the dialog has closed

    When I click on element "Test Extras"
    Then "New Item" should be in the group
    When I click on element "New Item"
    Then "New Item" should not be in the group
    When I click on "Submit"
    When the dialog has closed
    When I click on element "Test Extras"
    Then "New Item" should not be in the group