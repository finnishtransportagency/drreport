*** Settings ***
Documentation  Verify that API is working correctly.

Resource  common.robot

Test Setup  Initialize
Test Teardown  Delete All Sessions

*** Variables ***

*** Test Cases ***

Check API
  [Tags]  API  Requirement
  Check API  /dr-report/koodistot/tietolajit  nop
  Check API  /dr-report/koodistot/hallinnollinenluokka
  Check API  /dr-report/koodistot/kunnat  salo
  Check API  /dr-report/raportit/graafi1/20-07-2018/20-07-2018/734/190/1,2,3,99

*** Keywords ***

Check API
  [Arguments]  ${route}  ${q}=${EMPTY}
  &{params}  Create Dictionary  q=${q}
  Get API Request  ${route}  ${params}
  Get API Request Should Have Returned JSON

