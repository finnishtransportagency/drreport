pipeline {
    agent none
    stages {
        stage('Front-end') {
            agent {
                docker { image 'node:7-alpine' }
            }
            steps {
                sh ''' 
				pwd
				cd ./src/main/resources/static
				pwd			
				ls -la
				npm install
				rm -f index.html
				ls -la
				npm run html
				npm run css
				pwd
				npm run js
				npm run fonts
				ls -la
				ls -la ./styles/style.css
				ls -la ./js/bundle.js
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