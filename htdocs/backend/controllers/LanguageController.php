<?php

namespace backend\controllers;

use common\models\Language;
use common\models\query\LanguageQuery;
use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;

class LanguageController extends Controller
{
    public function actionIndex()
    {
        return $this->render('index');
    }



public function actionList($query)
{
    $models = Language::findAllByName($query);
    $items = [];

    foreach ($models as $model) {
        $items[] = ['name' => $model->name];
    }
    // We know we can use ContentNegotiator filter
    // this way is easier to show you here :)
    Yii::$app->response->format = \Yii::$app->response->format = 'json';

    return $items;
}




}
