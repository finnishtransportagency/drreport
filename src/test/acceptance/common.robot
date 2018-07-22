*** Settings ***
Documentation  Common resource file

Library  Collections
Library  OperatingSystem
Library  RequestsLibrary
Library  String
Library  XML

*** Variables ***
&{EMPTY_DICT}

${PROXY}  None

${SESSION_TIMEOUT}  10

*** Keywords ***
Get API Request
  [Arguments]  ${path}  ${params}=${EMPTY_DICT}
  ${response}  Get Request  api  ${path}  params=&{params}  allow_redirects=True
  Set Test Variable  ${RESPONSE}  ${response}
  Set Test Variable  ${STATUS_CODE}  ${response.status_code}

Get API Request Should Have Succeed
  [Arguments]  ${expected_status_code}=200 
  Should Be Equal As Strings  ${STATUS_CODE}  ${expected_status_code}

Get API Request Should Have Failed
  [Arguments]  ${expected_status_code}=404
  Should Be Equal As Strings  ${STATUS_CODE}  ${expected_status_code}

Get API Request Should Have Returned JSON
  Get API Request Should Have Succeed
  Should Contain  ${RESPONSE.headers['content-type']}  application/json
  Should Not Be Empty  ${RESPONSE.json()}

Initialize
  ${host}  Evaluate  "{0.scheme}://{0.netloc}".format(urlparse.urlsplit('${URL}'))  modules=urlparse
  ${path}  Evaluate  "{0.path}".format(urlparse.urlsplit('${URL}'))  modules=urlparse
  Run Keyword If  '${path}' == '/'  Set Variable  ${path}  ${EMPTY}
  &{proxies}  Create Dictionary
  Run Keyword If  '${PROXY}' != 'None'  Set To Dictionary  ${proxies}  http=${PROXY}  https=${PROXY}
  Create Session  api  ${host}  proxies=${proxies}  verify=True  max_retries=3  timeout=30
  Set Global Variable  ${URL_HOST}  ${host}
  Set Global Variable  ${URL_PATH}  ${path}
  Run Keyword If  '${path}' != '${EMPTY}'  Set Global Variable  ${URL_CTX}  ${path.split('/')[1]}
