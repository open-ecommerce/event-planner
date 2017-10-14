<?php

namespace frontend\controllers;
use common\models\Book;
use common\models\Favorite;
use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\helpers\Html;
use common\helpers\OeHelpers;

class FavoriteController extends Controller {
    public function actionActive($id) {
        Yii::$app->response->format = \Yii::$app->response->format = 'json';
        $data = [];
        if (Yii::$app->request->isAjax) {

            $userId = Yii::$app->user->identity->id;

            $favorite = Favorite::find()->where(['user_id' => $userId])->
                            andwhere(['book_id' => $id])->one();

            if ($favorite) {
                $favorite->delete();
                Yii::$app->getSession()->setFlash('info', [
                    'type' => 'success',
                    'icon' => 'fa fa-snowflake-o',
                    'title' => \Yii::t('app', Html::encode('Updating Favourite')),
                    'message' => \Yii::t('app', Html::encode("You unmarked as a Favourite")),
                ]);
                $data = ['sucess' => true, 'class' => 'no-active'];
            } else {
                $favorite = new Favorite();
                $favorite->user_id = $userId;
                $favorite->book_id = $id;
                if ($favorite->save()) {
                    Yii::$app->getSession()->setFlash('info', [
                        'type' => 'success',
                        'icon' => 'fa fa-snowflake-o',
                        'title' => \Yii::t('app', Html::encode('Updating Favourite')),
                        'message' => \Yii::t('app', Html::encode("You marked this book as a Favourite")),
                    ]);
                    $data = ['sucess' => true, 'class' => 'active'];
                }
            }
            return $data;
        }
    }

}
