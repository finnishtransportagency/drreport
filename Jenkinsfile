pipeline {
    agent none
    stages {
        stage('Front-end') {
            agent {
                docker { image 'node:alpine' }
            }
            steps {
                sh ''' 
				cd ./src/main/resources/static
				npm install
				npm run html
				npm run css
				npm run js2
				npm run fonts
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
            steps {
			    sh ''' 
				mvn install:install-file -Dfile=ojdbc14-10.2.0.4.0.jar -DgroupId=com.oracle -DartifactId=ojdbc14 -Dversion=10.2.0.4.0 -Dpackaging=jar
                mvn -B -DskipTests clean package
				cd target
				ls -la
				pwd
				'''
            }
        }
    }
}