def get_environment() {
    if (BRANCH_NAME.equals("develop")) { return "dev" }
    if (BRANCH_NAME.equals("master")) { return "prod" }
    if (BRANCH_NAME.startsWith("release-")) { return "stg" }
    return ""
}
def notify(message,color) {
    //slackSend(color: "${color}", message: "${JOB_NAME} - <${RUN_DISPLAY_URL}|${BUILD_DISPLAY_NAME}> - ${message}")
}
pipeline {
    agent none
    stages {
        stage('Front-end') {
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
                    image 'maven:alpine'
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
        }
    }
}