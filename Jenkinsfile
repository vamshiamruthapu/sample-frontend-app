pipeline {    
    agent {
        label ''
    }
    environment {
        NEXUS_CREDS = credentials('nexus-creds')
    }
    stages {
        stage('Building the Docker image') {
            steps {
                sh """
                    docker build -t 54.235.238.149:8082/sample-frontend-app/`echo $BRANCH_NAME | tr [:upper:] [:lower:]`:$BUILD_NUMBER .
                """
            }    
        }
    }    
}
