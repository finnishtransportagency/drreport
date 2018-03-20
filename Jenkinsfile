pipeline {
    agent none
    stages {
        stage('Front-end') {
            agent {
                docker { image 'node:6-alpine' }
            }
            steps {
                sh ''' 
				cd ./src/main/resources/static
				node --version				
				ls -la
				npm install
				npm run html
				npm run css
				npm run js2
				npm run fonts
				cd ./js
				ls -la
				'''
            }
        }
		stage('Back-end') {
            agent {
                docker {
                    image 'maven:3-alpine' 
                    args '-v /root/.m2:/root/.m2' 
                }
            }
            steps {
			    sh ''' 
				mvn install:install-file -Dfile=ojdbc14-10.2.0.4.0.jar -DgroupId=com.oracle -DartifactId=ojdbc14 -Dversion=10.2.0.4.0 -Dpackaging=jar
                mvn -B -DskipTests clean package
				cd target
				ls -la
				'''
            }
        }
    }
}