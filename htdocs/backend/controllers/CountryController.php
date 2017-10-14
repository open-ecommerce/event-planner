<?php

namespace backend\controllers;

use Yii;
use common\models\Country;
use common\models\CountryQuery;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

class CountryController extends Controller {

    public function behaviors() {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['post'],
                ],
            ],
        ];
    }

    public function actionList($query) {
        $models = Country::findAllByName($query);
        $items = [];

        foreach ($models as $model) {
            $items[] = ['id' => $model->id, 'country_name' => $model->country_name];
        }

        Yii::$app->response->format = \Yii::$app->response->format = 'json';

        return $items;
    }

}
