<?php

namespace frontend\controllers;

use common\models\Article;
use common\models\ArticleAttachment;
use frontend\models\search\ArticleSearch;
use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\data\ArrayDataProvider;
use common\helpers\OeHelpers;

/**
 * @author Eugene Terentev <eugene@terentev.net>
 */
class ShoutsController extends Controller {

    public function actionIndex() {

        $searchModel = new ArticleSearch();
        $dataProvider = $searchModel->search($_GET);        
        return $this->render('index', [
                    'model' => $dataProvider,
                    'searchModel' => $searchModel
        ]);
    }

}
