def get_environment() {
    if (BRANCH_NAME.equals("develop")) { return "dev" }
    if (BRANCH_NAME.equals("master")) { return "dev" }
    if (BRANCH_NAME.startsWith("release-")) { return "stg" }
    return ""
}
def notify(message,color) {
    //slackSend(color: "${color}", message: "${JOB_NAME} - <${RUN_DISPLAY_URL}|${BUILD_DISPLAY_NAME}> - ${message}")
}
pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: "5"))
        disableConcurrentBuilds()
    }
    stages {
        stage("Setup") {
            when { 
                expression { 
                    get_environment()?.trim() 
                } 
            }
            steps {
                script {
                    echo "t‰ss‰ tehd‰‰n tarvittavat flow asetusleikit"
                 }
            }
        }
        stage("Ack") {
            agent none
            options { 
                timeout(time: 5, unit: "MINUTES")
            }
            when { 
                expression { 
                    DEPLOY_TARGET
                } 
            }
            steps {
                notify("Stage 'Ack': Waiting for user input!","warning")
                input(
                    message: "Proceed with following settings?",
                    parameters: [
                        choice(choices: DEPLOY_TARGET, description: "Deploy target.", name: "deploy_target"),
                        choice(choices: ARTIFACT_ID, description: "Artifact ID", name: "artifact_id"),
                        choice(choices: ARTIFACT_VERSION, description: "Artifact version", name: "artifact_version"),
                        choice(choices: GROUP_ID, description: "Group ID", name: "group_id")
                    ]
                )
            }
            post {
                aborted { 
                    notify("Stage 'Ack': aborted!","warning") 
                }
            }
        }
        stage("Front-end") {
            agent {
                docker { image 'node:alpine' }
            }
			when {
                beforeAgent true 
				
                expression { 
                    get_environment()?.trim()
                } 
            }
            steps {
                sh '''
				cd ./src/main/resources/static
				npm install
				npm run build
				cd ../../../..
				'''
            }
        }
		stage('Back-end') {
            agent {
                docker {
                    image "maven:alpine"
                    args "--volume /data1/maven/:/m2/"
                    reuseNode true
                }
            }
            when {
                beforeAgent true 
                expression { 
                    get_environment()?.trim() 
                } 
            }
            steps {
			    sh ''' 
				mvn install:install-file -Dfile=ojdbc14-10.2.0.4.0.jar -DgroupId=com.oracle -DartifactId=ojdbc14 -Dversion=10.2.0.4.0 -Dpackaging=jar
                mvn -B -DskipTests clean package
				'''
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
                failure { 
                    notify("Stage 'Build': failure!","danger") 
                }
            }
        }
        stage("Confirm") {
            agent none
            options {
                timeout(time: 5, unit: "MINUTES")
            }
            when {
                branch "master"
            }
            steps {
                notify("Stage 'Confirm': Waiting for user input!","warning")
                input "Create release ${GROUP_ID}:${ARTIFACT_ID}@${ARTIFACT_VERSION} and deploy to ${DEPLOY_TARGET}?"
            }
            post {
                aborted { 
                    notify("Stage 'Confirm': aborted!","danger") 
                }
            }
        }

        stage("Publish") {
            agent {
                docker {
                    image "maven:alpine"
                    args "--volume /data1/maven/:/m2/"
                    reuseNode true
                }
            }
            when {
                beforeAgent true
                expression { 
                    get_environment()?.trim() 
                } 
            }
            steps {
                sh "${MAVEN_DEPLOY.join(' ')} ${MAVEN_SETTINGS}"
            }
            post {
                failure { 
                    notify("Stage 'Publish': failure!","danger") 
                }
            }
        }
        stage("Deploy") {
            when { 
                expression { 
                    get_environment()?.trim() 
                }
            }
            steps {
                sh "ansible localhost -m maven_artifact -a '${ANSIBLE_EXTRA_VARS}'"
            }
            post {
                failure { 
                    notify("Stage 'Deploy': failure!","danger")
                }
            }
        }
        stage("Test") {
            agent {
                docker {
                    image "python:2-alpine"
                    args "-u root"
                    reuseNode true
                }
            }
            when {
                beforeAgent true
                expression { 
                    get_environment()?.trim() 
                } 
            }
            steps {
                ...
            }
            post {
                always {
                    publishHTML target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: "src",
                        reportFiles: "*.html",
                        reportName: 'RF Reports'
                    ]
                }
                failure {
                    notify("Stage 'Test': failure!","danger") 
                }
            }
        }
    }
    post {
        aborted {
            nofity("Job aborted!","warning")
        }
        always { 
            deleteDir()
        }
        failure { 
            notify("Job failure!\nCheck <${BUILD_URL}/console|console>!","danger")
        }
        success {
            script {
                if (get_environment()?.trim()) {
                    notify("Job success!","good")       
                }
            }
        }
    }
}