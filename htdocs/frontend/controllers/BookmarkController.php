<?php

namespace frontend\controllers;

use common\models\Book;
use frontend\models\search\BookmarkSearch;
use common\models\Bookmark;
use common\models\query\BookmarkQuery;
use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\helpers\Html;
use common\helpers\OeHelpers;

class BookmarkController extends Controller {

    public function actionIndex() {
        $bookmarks = new Bookmark;

        $searchModel = new BookmarkSearch;
        $dataProvider = $searchModel->search($_GET);

        if (\Yii::$app->mobileDetect->isMobile() && !\Yii::$app->mobileDetect->isTablet()) {
            $view = 'index-mobile';
        } else {
            $view = 'index';
        }

        return $this->render($view, [
                    'model' => $dataProvider,
                    'searchModel' => $searchModel,
        ]);
    }

    public function actionList($query) {
        $models = Bookmark::findAllByName($query);
        $items = [];

        foreach ($models as $model) {
            $items[] = ['name' => $model->name];
        }
        // We know we can use ContentNegotiator filter
        // this way is easier to show you here :)
        Yii::$app->response->format = \Yii::$app->response->format = 'json';

        return $items;
    }

    public function actionActive($id, $type, $url, $title, $author) {
        Yii::$app->response->format = \Yii::$app->response->format = 'json';
        $data = [];
        if (Yii::$app->request->isAjax) {

            $userId = Yii::$app->user->identity->id;

            $bookmark = Bookmark::find()->where(['user_id' => $userId])->
                            andwhere(['bookmark_id' => $id])->one();

            if ($bookmark) {
                $bookmark->delete();
                Yii::$app->getSession()->setFlash('info', [
                    'type' => 'success',
                    'icon' => 'fa fa-bookmark',
                    'title' => \Yii::t('app', Html::encode('Updating Bookmark')),
                    'message' => \Yii::t('app', Html::encode("The bookmark was deleted")),
                ]);
                $data = ['sucess' => true, 'class' => 'no-active'];
            } else {
                $bookmark = new Bookmark();
                $bookmark->type = $type;
                $bookmark->user_id = $userId;
                $bookmark->bookmark_id = $id;
                $bookmark->url = $url;
                $bookmark->title = $title;
                $bookmark->author = $author;
                if ($bookmark->save()) {
                    Yii::$app->getSession()->setFlash('info', [
                        'type' => 'success',
                        'icon' => 'fa fa-bookmark',
                        'title' => \Yii::t('app', Html::encode('Updating Bookmark')),
                        'message' => \Yii::t('app', Html::encode("The bookmark was created")),
                    ]);
                    $data = ['sucess' => true, 'class' => 'active'];
                } else {
                    $data = ['sucess' => false, 'class' => 'no-active'];
                }
            }
            return $data;
        }
    }

    public function actionDelete($id) {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Bookmark model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     *
     * @param int $id
     *
     * @return Book the loaded model
     *
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id) {
        if (($model = Bookmark::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

}
