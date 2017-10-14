<?php

namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\AccessControl;

/**
 * @author Eugene Terentev <eugene@terentev.net>
 */
class PartialController extends Controller {

    public function actionMessage() {

        if (Yii::$app->request->isAjax) {
            return $this->renderAjax('/partial/_message');
        }
    }

}
