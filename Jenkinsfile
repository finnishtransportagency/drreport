pipeline {
    agent none
    stages {
        stage('Front-end') {
            agent {
                docker { image 'node:7-alpine' }
            }
            steps {
                sh ''' 
				cd ./src/main/resources/static
				pwd			
				ls -la
				npm install
				npm run html
				npm run css
				npm install -g browserify watchify
				browserify -r ./modules/select2Controller.js:select2Controller -r ./modules/c3Controller.js:c3Controller ./src/js/main.js -r ./modules/dateTimeController.js:dateTimeController > ./js/bundle.js
				npm run fonts
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