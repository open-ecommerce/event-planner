<?php

// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace backend\controllers;

use Yii;
use yii\web\Controller;
use backend\models\Email;
use yii\helpers\Html;
use common\helpers\OeHelpers;

/**
 * ContactController implements the CRUD actions for Contact model.
 */
class CommunicationController extends Controller {

    public function actionSendEmail() {
        $model = new Email();
        if ($model->load(Yii::$app->request->post())) {
            $adminEmail = Yii::$app->params['adminEmail'];
            if ($model->emailCustom($adminEmail, $model)) {
                        Yii::$app->getSession()->setFlash('info', [
                            'type' => 'success',
                            'icon' => 'fa fa-users',
                            'title' => \Yii::t('app', Html::encode('Sending Email')),
                            'message' => \Yii::t('app', Html::encode("Email sent")),
                        ]);
                return $this->refresh();
            } else {
                    Yii::$app->getSession()->setFlash('alert', [
                    'type' => 'success',
                    'icon' => 'fa fa-users',
                    'title' => \Yii::t('app', Html::encode('Sending Email')),
                    'message' => \Yii::t('app', Html::encode("Some kind of problem sending the mail")),
                ]);
            }
        }
        return $this->render('send-email', [
                    'model' => $model
        ]);
    }
    
    
    
}
