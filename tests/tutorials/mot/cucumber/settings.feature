Feature: Settings

  As a User I want to be able to log in with my credentials

  Scenario: Delivery Charge
    Given We have logged in as "fake.email90@gmail.com" with password "abc123!@#"
    When I click on element "Settings"
    When I click on sidebar button "Order Settings"
    Then Subtitle should be "Aydin's test venue 3"
    When I type "100" into "delivery_charge"
    When I click on "Update order settings"