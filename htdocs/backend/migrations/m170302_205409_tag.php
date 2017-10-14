<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205409_tag extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%tag}}',
            [
                'id'=> $this->primaryKey(11),
                'frequency'=> $this->integer(11)->null()->defaultValue(0),
                'name'=> $this->string(150)->null()->defaultValue('0'),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%tag}}');
    }
}
